import { Injectable } from '@angular/core';
import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filters = {
    movies: {
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
    },
    tvshows: {},
    clips: {},
    music: {},
    musicvideos: {},
    photos: {}
  };

  public listItems = {
    movies: {
      libraries: [],
      genres: [],
      parentalRatings: [],
      years: [],
      tags: []
    },
    tvshows: {},
    clips: {},
    music: {},
    musicvideos: {},
    photos: {}
  }


  public getFilters(type: string) {
    return this.filters[type];
  }

  public setFilters(type: string, newFilters: {}) {
    this.filters[type] = newFilters;
    if (this.filters[type] == newFilters) return true;
    return false;
  }

  public setFilterSingle(type: string, group: string, subtype: string){
    if (group == 'status'){
        this.filters[type][group][subtype] = !this.filters[type][group][subtype];
    }
    else {
      if (!this.filters[type][group].includes(subtype)){
        this.filters[type][group].push(subtype);
      }
      else {
        let index = this.filters[type][group].indexOf(subtype, 0);
        if (index > -1 ) this.filters[type][group].splice(index, 1);
      }
    }
  }

  public resetFilters(type: string) {
    let defaultFilters = {
      movies: {
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
      },
      tvshows: {},
      clips: {},
      music: {},
      musicvideos: {},
      photos: {}
    }
    this.filters[type] = defaultFilters[type];
    if (this.filters[type] == defaultFilters[type]) return true;
    return false;
  }

  public filterList(type: string,  items: any[]) {
    
    let f = this.filters[type];
    console.log(f)
    
    for (let i in items){
      items[i].show = false;
      if (f.status.watched   && !items[i].watched ) continue;
      if (f.status.paused    && !items[i].paused  ) continue;
      if (f.status.unwatched &&  items[i].watched ) continue;
      if (f.status.favorite  && !items[i].favorite) continue;

      let matches = false;

      // Library Filtering: Matching *ANY* of selected Libraries
      if (f.libraries.length > 0){
        for (let x of f.libraries){
          if (items[i].trueParent == x){
            matches = true;
            break;
          }
        }
        if (!matches) continue;
        matches = false;
      }

      // Genre Filtering: Need to match *ALL* selected genres
      if (f.genres && f.genres.length > 0){
        for (let x of f.genres){
          if (!items[i].genres.includes(x)){
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
      if (f.parentalRatings && f.parentalRatings.length > 0){
        for (let x of f.parentalRatings){
          if (items[i].parentalRating == x){
            matches = true;
            break;
          }
        }
        if (!matches) continue;
        matches = false;
      }

      // Year Filtering: Matching *ANY* of selected years
      if (f.years && f.years.length > 0){
        for (let x of f.years){
          if (items[i].year == x){
            matches = true;
            break;
          }
        }
        if (!matches) continue;
        matches = false;
      }
      
      // Tag Filtering: Need to match *ALL* selected tags
      if (f.tags && f.tags.length > 0){
        for (let x of f.tags){
          if (!items[i].tags.includes(x)){
            matches = false;
            break
          }
          else {
            matches = true;
          }
        }
        if (!matches) continue;
      }
      items[i].show = true;
    }
    return items;
  }

  public createList(type: string, items: any[]){

  }
  
  constructor() { }
}
