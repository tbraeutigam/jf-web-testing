import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.sass']
})
export class LandingScreenComponent implements OnInit {
  private itemsInprogressNew = [];
  private userLibraries = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    let server = 'https://jellyfin.media.braeutigam.tech/emby';
    let user = '5a613f8ab43645bc8f24b4443b11c94a';
    
    this.apiService.getUserLibraries(user)
                   .subscribe((data: {} ) => {
                     this.userLibraries = data['Items'];
                   });
    

    // Get all Resumables
    let fields = [ 'Name', 'Id', 'UserData', 'ImageTags'];
    let options = {
      SortBy: "DatePlayed",
      SortOrder: "Descending",
      Recursive: "True",
      Filters: "IsResumable"
    };
    this.apiService.getItems(user, '', fields, options)
         .subscribe((data: {} ) => {

           let processed = [];
           for (let i of data['Items']){
             let tmp = {
                id: i['Id'],
                progress: i['UserData']['PlayedPercentage'],
                image: '',
                name: i['Name']
             }
             if (i['ImageTags']['Thumb'] && i['ImageTags']['Thumb'] != ''){
              tmp.image = `${server}/Items/${tmp.id}/Images/Thumb/0`;
             }
             else {
               tmp.image = `${server}/Items/${tmp.id}/Images/Primary/0`;
             }
             processed.push(tmp)
           }

           this.itemsInprogressNew = processed;
         });
  }

}
