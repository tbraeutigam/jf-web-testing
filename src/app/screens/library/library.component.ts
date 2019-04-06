// Angular Imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Custom Imports
import { ApiService } from '../../services/api.service';
import { ConfigService } from '../../services/config.service';
import { FilterService } from '../../services/filter.service';

@Component({
  templateUrl: './library.component.html'
})

export class LibraryComponent implements OnInit {
  private server = this.configService.getServer();
  private user = this.configService.getUser();
  private itemType: string;
  private itemTypeInclude: string;

  private active =  {
    filters : {},
    special: {}
  };

  private allItems = {};
  private libraryInfo = {
    available: [],
    single: false,
    fetching: [],
    done: []
  };


  constructor(private apiService: ApiService,
    private f: FilterService,
    private configService: ConfigService,
    private route: ActivatedRoute
  ) { }

  getDefaultFilters(){
    let res = {
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
      tags: [],
      matchAll: ['genres', 'tags'],
      matchAny: ['parentalRatings', 'years', 'libraries'],
      iterFilters: [['Genres', 'genres'],
                    ['Tags', 'tags'],
                    ['Parental Ratings', 'parentalRatings'],
                    ['Years', 'years']
                  ]
    };
    return res;
  }

  resetFilters(){
    let param = this.getDefaultFilters();
    if (this.f.resetFilters(this.itemType, param)){
      this.runFilter();
      this.active.filters = {};
    }
  }

  updateFilterSingle(group: string, subtype: string){
    this.f.setFilterSingle(this.itemType, group, subtype);
    this.runFilter();
  }
  

  runFilter(){
    this.allItems[this.itemType] = this.f.filterList(this.itemType, this.allItems[this.itemType]);
  }
  
  getLibraryItems(xLibrary: string){
    let fields = [ 'Name', 'Id', 'UserData', 'ImageTags' ];
    let options = {
      SortBy: "SortName",
      SortOrder: "Ascending",
      Recursive: "True",
      parentId: xLibrary
    };


    this.libraryInfo.fetching.push(xLibrary);
    this.apiService.getItems(this.user, this.itemTypeInclude, fields, options)
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
                          parentalRatings: i['OfficialRating'],
                          favorite: i['UserData']['isFavorite'],
                          hd: i['isHD'],
                          years: i['ProductionYear'],
                          tags: [],
                          playcount: i['UserData']['PlayCount'],
                          libraries: xLibrary
                        }

                        // Check Resumability
                        if (tmp.progress > 0 && tmp.progress < 100){
                          tmp.paused = true;
                        }

                        // Fix Parental Rating being Empty
                        if (tmp.parentalRatings == '' || tmp.parentalRatings === undefined ) tmp.parentalRatings = "Unavailable";
                        
                        // Fix Year being empty
                        if (tmp.years == '' || tmp.years === undefined ) tmp.years = "Unavailable";
                        
                        // Normalize & deduplicate Genres and Tags
                        if (i['Tags'] !== undefined && i['Tags'].length > 0){
                          for (let x of i['Tags']){
                            if (!tmp.tags.includes(x)) tmp.tags.push(x.normalize());
                          }
                        }
                        if (i['Genres'] !== undefined && i['Genres'].length > 0){
                          for (let x of i['Genres']){
                            if (!tmp.genres.includes(x)) tmp.genres.push(x.normalize());
                          }
                        }

                        this.allItems[this.itemType].push(tmp)
                      }
                      this.libraryInfo.done.push(xLibrary);
                      if (this.libraryInfo.done.length == this.libraryInfo.available.length || this.libraryInfo.single){
                        this.postProcessItems()
                      }
    });
  }

  postProcessItems(){
    let itemGenres = [];
    let itemParentalRatings = [];
    let itemYears = [];
    let itemTags = [];

    this.allItems[this.itemType].sort(function (a, b){
      if (a.name < b.name) return -1;
      if (a.name > b.name) return  1;
      return 0;
    });

    for (let i of this.allItems[this.itemType]){

      // Populate Genres
      for (let genre of i['genres']){
        if (!itemGenres.includes(genre)) itemGenres.push(genre);
      }

      // Populate Tags
      for (let tag of i['tags']){
        if (!itemTags.includes(tag)) itemTags.push(tag);
      }

      // Populate Parental Ratings
      if (!itemParentalRatings.includes(i['parentalRatings'])) itemParentalRatings.push(i['parentalRatings']);

      // Populate Years
      if (!itemYears.includes(i['years'])) itemYears.push(i['years']);

    }

    this.f.listItems[this.itemType] = {
      libraries: [],
      genres: itemGenres.sort(),
      parentalRatings: itemParentalRatings.sort(),
      years: itemYears.sort(),
      tags: itemTags.sort()
    }
    this.active.special['category-tags'] = itemTags.length > 0 ? true : false;
    this.active.special['category-parentalRatings'] = itemParentalRatings.length > 0 ? true : false;
    this.active.special['category-genres'] = itemGenres.length > 0 ? true : false;
    this.active.special['category-years'] = itemYears.length > 0 ? true : false;
  }

  getLibraries(slug){
    this.apiService
          .getUserLibraries(this.user)
          .subscribe((data: {} ) => {

            //Check Slug for Library-info
            let slugLibrary = null;
            if (slug.length == 3 && slug[1] == 'libraries') slugLibrary = slug[2];

            // Reset some variables, in case we have 'prior states'
            this.resetFilters();
            this.allItems[this.itemType] = [];
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
              if (i['CollectionType'] == this.itemType){
                this.libraryInfo.available.push(tmp);
                if (slugLibrary !== null){
                  if (tmp.id == slugLibrary) this.getLibraryItems(tmp.id);
                }
                else {
                  this.getLibraryItems(tmp.id);
                }
              }
            }
          });
  }
  ngOnInit() {
    

    this.route.url.subscribe((urlComponents) => {
      // Make sure 'All Libraries' is highlighted correctly
      this.active.special['libraries-all'] = urlComponents.length == 1 ? true : false;

      switch (urlComponents[0].toString()){
        case 'movies':
            this.itemType =  'movies';
            this.itemTypeInclude = 'Movie';
          break;
        case 'tvshows':
            this.itemType = 'tvshows';
            this.itemTypeInclude = 'Series';
          break;
        case 'clips':
          break;
      }
      this.f.setFilters(this.itemType, this.getDefaultFilters());
      this.getLibraries(urlComponents);
    })
  }
}
