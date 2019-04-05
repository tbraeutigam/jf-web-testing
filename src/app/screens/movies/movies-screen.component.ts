// Angular Imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

// Custom Imports
import { ApiService } from '../../services/api.service';
import { ConfigService } from '../../services/config.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-movies-screen',
  templateUrl: './movies-screen.component.html',
  styleUrls: ['./movies-screen.component.sass']
})

export class MoviesScreenComponent implements OnInit {
  private server = this.configService.getServer();
  private user = this.configService.getUser();


  private selectedEntry = {};
  private filtersApplied = {
    status: {
      paused: false,
      unwatched: false,
      watched: false,
      favorite: false
    },
    libraries: [],
    genres: [],
    parentalRatings: [],
    years: [],
    tags: []
  }

  private filters = {
    libraries: [],
    genres: [],
    parentalRatings: [],
    years: [],
    tags: []
  }

  private allItems = [];
  private libraryInfo = {
    available: [],
    single: false,
    fetching: [],
    done: []
  };


  constructor(private apiService: ApiService,
    private filterService: FilterService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private location: Location) { }

  resetFilters(){
    this.filtersApplied = {
      status: {
        paused: false,
        unwatched: false,
        watched: false,
        favorite: false
      },
      libraries: [],
      genres: [],
      parentalRatings: [],
      years: [],
      tags: []
    }
    for (let i in this.allItems){
      this.allItems[i].show = true;
    }
  }
  updateFilterSingle(group: string, subtype: string){

    if (group == 'status'){
        switch(subtype){
          case 'favorite':
            this.filtersApplied.status.favorite = !this.filtersApplied.status.favorite;
            break;
          case 'paused':
            this.filtersApplied.status.paused = !this.filtersApplied.status.paused;
            break;
          case 'watched':
            this.filtersApplied.status.watched = !this.filtersApplied.status.watched;
            break;
          case 'unwatched':
            this.filtersApplied.status.unwatched = !this.filtersApplied.status.unwatched;
            break;
        }
      }
      else {
        switch (group) {
          case 'library':
              if (!this.filtersApplied.libraries.includes(subtype)){
                this.filtersApplied.libraries.push(subtype);
              }
              else {
                let index = this.filtersApplied.libraries.indexOf(subtype, 0);
                if (index > -1) this.filtersApplied.libraries.splice(index, 1);
              }
            break;
          case 'genres':
              if (!this.filtersApplied.genres.includes(subtype)){
                this.filtersApplied.genres.push(subtype);
              }
              else {
                let index = this.filtersApplied.genres.indexOf(subtype, 0);
                if (index > -1) this.filtersApplied.genres.splice(index, 1);
              }
            break;
          case 'parentalRatings':
              if (this.filters.parentalRatings.includes(subtype)
                  && !this.filtersApplied.parentalRatings.includes(subtype)){
                this.filtersApplied.parentalRatings.push(subtype);
              }
              else {
                let index = this.filtersApplied.parentalRatings.indexOf(subtype, 0);
                if (index > -1) this.filtersApplied.parentalRatings.splice(index, 1);
              }
            break;
          case 'years':
              if (this.filters.years.includes(subtype)
                  && !this.filtersApplied.years.includes(subtype)){
                this.filtersApplied.years.push(subtype);
              }
              else {
                let index = this.filtersApplied.years.indexOf(subtype, 0);
                if (index > -1) this.filtersApplied.years.splice(index, 1);
              }
            break;
          case 'tags':
              if (this.filters.tags.includes(subtype)
                  && !this.filtersApplied.tags.includes(subtype)){
                this.filtersApplied.tags.push(subtype);
              }
              else {
                let index = this.filtersApplied.tags.indexOf(subtype, 0);
                if (index > -1) this.filtersApplied.tags.splice(index, 1);
              }
            break;
          }
      }

      this.runFilter()
  }
  runFilter() {
    // Apply filters

    let f = this.filtersApplied;

    for (let i in this.allItems){
      this.allItems[i].show = false;
      if (f.status.watched   && !this.allItems[i].watched ) continue;
      if (f.status.paused    && !this.allItems[i].paused  ) continue;
      if (f.status.unwatched &&  this.allItems[i].watched ) continue;
      if (f.status.favorite  && !this.allItems[i].favorite) continue;

      let matches = false;

      // Library Filtering: Matching *ANY* of selected Libraries
      if (f.libraries.length > 0){
        for (let x of f.libraries){
          if (this.allItems[i].trueParent == x){
            matches = true;
            break;
          }
        }
        if (!matches) continue;
        matches = false;
      }

      // Genre Filtering: Need to match *ALL* selected genres
      if (f.genres.length > 0){
        for (let x of f.genres){
          if (!this.allItems[i].genres.includes(x)){
            matches = false;
            break
          }
          else {
            matches = true;
          }
        }
        if (!matches) continue;
        matches = false; 
      }

      // Parental Rating Filtering: Matching *ANY* of selected ratings
      if (f.parentalRatings.length > 0){
        for (let x of f.parentalRatings){
          if (this.allItems[i].parentalRating == x){
            matches = true;
            break;
          }
        }
        if (!matches) continue;
        matches = false;
      }

      // Year Filtering: Matching *ANY* of selected years
      if (f.years.length > 0){
        for (let x of f.years){
          if (this.allItems[i].year == x){
            matches = true;
            break;
          }
        }
        if (!matches) continue;
        matches = false;
      }
      
      // Tag Filtering: Need to match *ALL* selected tags
      if (f.tags.length > 0){
        for (let x of f.tags){
          if (!this.allItems[i].tags.includes(x)){
            matches = false;
            break
          }
          else {
            matches = true;
          }
        }
        if (!matches) continue;
      }

      this.allItems[i].show = true;
    }
  }

  getMovieItems(xLibrary: string){
    // Get all Movies per Library, then as Detail.
    let fields = [ 'Name', 'Id', 'UserData', 'ImageTags' ];
    let options = {
      SortBy: "SortName",
      SortOrder: "Ascending",
      Recursive: "True",
      IncludeItemTypes: "Movie",
      parentId: xLibrary
    };

    this.libraryInfo.fetching.push(xLibrary);

    this.apiService.getItems(this.user, '', fields, options)
                    .subscribe((data: {}) => {

                      // Process Items for easier templating
                      for (let i of data['Items']){
                        let tmp = {
                          show: true,
                          watched: i['UserData']['PlayedPercentage'] == 100 ? true : false,
                          id: i['Id'],
                          progress: i['UserData']['PlayedPercentage'],
                          image: `${this.server}/Items/${i['Id']}/Images/Primary/0`,
                          name: i['Name'],
                          paused: false,
                          genres: i['Genres'],
                          parentalRating: i['OfficialRating'],
                          favorite: i['UserData']['isFavorite'],
                          hd: i['isHD'],
                          year: i['ProductionYear'],
                          tags: i['Tags'],
                          playcount: i['UserData']['PlayCount'],
                          trueParent: xLibrary
                        }

                        // Check Resumability
                        if (tmp.progress > 0 && tmp.progress < 100){
                          tmp.paused = true;
                        }

                        // Fix Parental Rating being Empty
                        if (tmp.parentalRating == '' || tmp.parentalRating === undefined ) tmp.parentalRating = "Unavailable";



                        this.allItems.push(tmp)
                      }
                      this.libraryInfo.done.push(xLibrary);
                      if (this.libraryInfo.done.length == this.libraryInfo.available.length || this.libraryInfo.single){
                        this.postProcessItems()
                      }
    });
  }

  postProcessItems(){
    let itemLibraries = [];
    let itemGenres = [];
    let itemParentalRatings = [];
    let itemYears = [];
    let itemTags = [];

    this.allItems.sort(function (a, b){
      if (a.name < b.name) return -1;
      if (a.name > b.name) return  1;
      return 0;
    });

    for (let i of this.allItems){

      // Populate Genres
      for (let genre of i['genres']){
        if (!itemGenres.includes(genre)) itemGenres.push(genre);
      }

      // Populate Tags
      for (let tag of i['tags']){
        if (!itemTags.includes(tag)) itemGenres.push(tag);
      }

      // Populate Parental Ratings
      if (!itemParentalRatings.includes(i['parentalRating'])) itemParentalRatings.push(i['parentalRating']);

      // Populate Years
      if (!itemYears.includes(i['year'])) itemYears.push(i['year']);

    }

    this.filters = {
      libraries: [],
      genres: itemGenres.sort(),
      parentalRatings: itemParentalRatings.sort(),
      years: itemYears.sort(),
      tags: itemTags.sort()
    }
    this.selectedEntry['filters-tags'] = itemTags.length > 0 ? true : false;
    this.selectedEntry['filters-parentalRatings'] = itemParentalRatings.length > 0 ? true : false;
    this.selectedEntry['filters-genres'] = itemGenres.length > 0 ? true : false;
    this.selectedEntry['filters-years'] = itemYears.length > 0 ? true : false;
  }
  getMovieLibraries(slug){
    this.apiService
          .getUserLibraries(this.user)
          .subscribe((data: {} ) => {

            //Check Slug for Library-info
            let slugLibrary = null;
            if (slug.length == 3 && slug[1] == 'libraries') slugLibrary = slug[2];

            // Reset some variables, in case we have 'prior states'
            this.resetFilters();
            this.allItems = [];
            this.libraryInfo = {
              available: [],
              single: slugLibrary !== null ? true : false,
              fetching: [],
              done: []
            };

            // Filter out Movie-Libraries only
            for (let i of data['Items']){
              let tmp = {
                name: i['Name'],
                id: i['Id']
              };
              
              if (i['CollectionType'] == 'movies'){
                this.libraryInfo.available.push(tmp);
                if (slugLibrary !== null){
                  if (tmp.id == slugLibrary) this.getMovieItems(tmp.id);
                }
                else {
                  this.getMovieItems(tmp.id);
                }
              }
            }
          });
  }
  ngOnInit() {
    this.route.url.subscribe((val) => {
      // Make sure 'All Libraries' is highlighted correctly
      this.selectedEntry['main-all-libraries'] = val.length == 1 ? true : false;

      this.getMovieLibraries(val);
    })
  }
}
