import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Custom Imports
import { ApiService } from '../../services/api.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.sass']
})
export class MovieDetailComponent implements OnInit {
  private user = this.configService.getUser();
  private server = this.configService.getServer();

  private itemType = '';

  private itemId: any;
  private info: {
    raw: any,
    watched: boolean,
    id: string,
    progress: number,
    image: string,
    name: string,
    originalName: string,
    paused: boolean,
    genres: any[],
    parentalRatings: string,
    favorite: boolean,
    hd: boolean,
    years: string,
    tags: any[],
    playcount: number,
    people: any[],
    stars: any[],
    type: string,
    resolution: string,
    tagline: string,
    description: string
  };
  getInfoString(){
    return JSON.stringify(this.info);
  }

  constructor(private apiService: ApiService,
    private configService: ConfigService,
    private route: ActivatedRoute
  ) { }

  arrayFor(n: number){
    let x = Array();
    for (let i = 0; i < n; i++){
      x.push(i);
    }
    return x;
  }

  getDetail(){
    this.apiService.getItem(this.user, this.itemId).subscribe((data: {}) => {
      this.info = {
        raw: data,
        watched: data['UserData']['PlayedPercentage'] == 100 ? true : false,
        id: data['Id'],
        progress: data['UserData']['PlayedPercentage'],
        image: `${this.server}/Items/${data['Id']}/Images/Primary/0`,
        name: data['Name'],
        originalName: data['OriginalTitle'],
        paused: false,
        genres: data['Genres'],
        parentalRatings: data['OfficialRating'],
        favorite: data['UserData']['IsFavorite'],
        hd: data['IsHD'],
        years: data['ProductionYear'],
        tags: [],
        playcount: data['UserData']['PlayCount'],
        people: data['People'],
        stars: [],
        type: data['Type'],
        resolution: `${data['Width']}x${data['Height']}`,
        tagline: data['Taglines'][0],
        description: data['Overview']
      }

      // Set Link-Back Type
      if (this.info.type == 'Movie') this.itemType = 'movies';

      // Check Resumability
      if (this.info.progress > 0 && this.info.progress < 100){
        this.info.paused = true;
      }

      // Work out stars
      if (data['CommunityRating']){
        let stars = data['CommunityRating'] / 2;
        let starsFixed = stars.toFixed() as unknown as number;
        let calc = starsFixed - stars;
        if (calc > 0 && calc < 0.25){
          this.info.stars[0] = starsFixed;
          this.info.stars[1] = 0;
          this.info.stars[2] = 5 - starsFixed;
        }
        else if ( calc > 0 && calc > 0.25){
          this.info.stars[0] = starsFixed;
          this.info.stars[1] = 1;
          this.info.stars[2] = 4 - starsFixed;
        } else if (calc < 0 && calc > -0.25){
          this.info.stars[0] = starsFixed;
          this.info.stars[1] = 0;
          this.info.stars[2] = 5 - starsFixed;
        } else if (calc < 0 && calc < -0.25){
          this.info.stars[0] = starsFixed - 1;
          this.info.stars[1] = 1;
          this.info.stars[2] = 4 - starsFixed;
        }
      } 
      else {
        this.info.stars = null;
      }
      
      // Fix Parental Rating being Empty
      if (this.info.parentalRatings == '' || this.info.parentalRatings === undefined ) this.info.parentalRatings = "Unavailable";
      
      // Fix Year being empty
      if (this.info.years == '' || this.info.years === undefined ) this.info.years = "Unavailable";
      
      // Normalize & deduplicate Genres and Tags
      if (data['Tags'] !== undefined && data['Tags'].length > 0){
        for (let x of data['Tags']){
          if (!this.info.tags.includes(x)) this.info.tags.push(x.normalize());
        }
      }
      if (data['Genres'] !== undefined && data['Genres'].length > 0){
        for (let x of data['Genres']){
          if (!this.info.genres.includes(x)) this.info.genres.push(x.normalize());
        }
      }
    })


  }

  getChildren(){

  }
  ngOnInit() {

    // Populate some default data
    // To not have console errors before data is fetched.
    this.info = {
      raw: {},
      watched: false,
      id: '',
      progress: 0,
      image: '',
      name: '',
      originalName: '',
      paused: false,
      genres: [],
      parentalRatings: '',
      favorite: false,
      hd: false,
      years: '',
      tags: [],
      playcount: 0,
      people: [],
      stars: [],
      type: '',
      resolution: '',
      tagline: '',
      description: ''
    }
    this.route.url.subscribe((urlComponents) => {
      if (urlComponents.length >= 3){
        this.itemId = urlComponents[2];
        this.getDetail();
      }
      else {
        this.itemId = null;
      }
      
    })
  }

}
