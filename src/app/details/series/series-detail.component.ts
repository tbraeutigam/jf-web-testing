import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Custom Imports
import { ApiService } from '../../services/api.service';
import { ConfigService } from '../../services/config.service';


@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.component.html',
  styleUrls: ['./series-detail.component.sass']
})
export class SeriesDetailComponent implements OnInit {
  private user = this.configService.getUser();
  private server = this.configService.getServer();

  private state: any;

  private itemType = '';

  private itemId: any;
  private seasons: any[];
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

  toggleState(name: string, season?: string){
    if (season && this.state['displaySeason'] == season){
      this.state['displaySeason'] = '';
      this.state['subitems'] -= 1;
    }
    else if (season && this.state['displaySeason'] == ''){
      this.state['displaySeason'] = season;
      this.state['subitems'] += 1
    }
    else if (season){
      this.state['displaySeason'] = season;
    }
    else {
      if (this.state[name]){
        this.state['subitems'] -= 1
      } else {
        this.state['subitems'] += 1
      }
      this.state[name] = !this.state[name];
    }
    
  }

  getStars(rating){
    if (!rating) { return null; };
    let res = [];
    let stars = rating / 2;
    let starsFixed = stars.toFixed() as unknown as number;
    let starsFloor = Math.floor(stars);
    let calc = Math.abs(starsFixed - stars);
    if (calc > 0 && calc < 0.25){
      res[0] = starsFloor;
      res[1] = 0;
      res[2] = 5 - starsFloor;
    }
    else if (calc > 0.25 && calc <= 0.75){
      res[0] = starsFloor;
      res[1] = 1;
      res[2] = 4 - starsFixed;
    }
    else if (calc > 0.75){
      res[0] = starsFloor + 1;
      res[1] = 0;
      res[2] = 4 - starsFloor;
    }
    return res;
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
        stars: this.getStars(data['CommunityRating']),
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

  getEpisodes(seasonId, index){
    this.seasons[index]['episodes'] = [];
    this.apiService.getChildren(this.user, seasonId, 'FALSE').subscribe((data: {}) => {
      for (let i of data['Items']){
        var tmp = {
          raw: i,
          watched: i['UserData']['Played'],
          id: i['Id'],
          progress: i['UserData']['PlayedPercentage'],
          image: `${this.server}/Items/${i['Id']}/Images/Primary/0`,
          name: i['Name'],
          originalName: i['OriginalTitle'],
          paused: false,
          genres: i['Genres'],
          parentalRatings: i['OfficialRating'],
          favorite: i['UserData']['IsFavorite'],
          hd: i['IsHD'],
          years: i['ProductionYear'],
          tags: [],
          playcount: i['UserData']['PlayCount'],
          people: i['People'],
          stars: this.getStars(i['CommunityRating']),
          type: i['Type'],
          resolution: `${i['Width']}x${i['Height']}`,
          tagline: i['Taglines'][0],
          description: i['Overview']
        }
        this.seasons[index]['episodes'].push(tmp); 
      }
    })
  }

  getSeasons(){
    this.apiService.getChildren(this.user, this.itemId, 'FALSE').subscribe((data: {}) => {
      for (let i of data['Items']){
        var tmp = {
          raw: i,
          watched: i['UserData']['PlayedPercentage'] == 100 ? true : false,
          id: i['Id'],
          progress: i['UserData']['PlayedPercentage'],
          image: `${this.server}/Items/${i['Id']}/Images/Primary/0`,
          name: i['Name'],
          originalName: i['OriginalTitle'],
          paused: false,
          genres: i['Genres'],
          parentalRatings: i['OfficialRating'],
          favorite: i['UserData']['IsFavorite'],
          hd: i['IsHD'],
          years: i['ProductionYear'],
          tags: [],
          playcount: i['UserData']['PlayCount'],
          people: i['People'],
          stars: [],
          type: i['Type'],
          resolution: `${i['Width']}x${i['Height']}`,
          tagline: i['Taglines'][0],
          description: i['Overview']
        }
        let res = this.seasons.push(tmp);
        this.getEpisodes(tmp.id, res -1);
      }
    })
  }

  ngOnInit() {
    

    this.route.url.subscribe((urlComponents) => {
      // Populate some default data
      // To not have console errors before data is fetched.
      this.state = {};
      this.state['subitems'] = 0;
      this.state['displaySeason'] = '';
      this.seasons = [];

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
      if (urlComponents.length >= 3){
        this.itemId = urlComponents[2];
        this.getDetail();
        this.getSeasons();
        if (urlComponents.length == 4){
          this.toggleState('season', urlComponents[3] as any as string)
        }
      }
      else {
        this.itemId = null;
      }
      
    })
  }

}
