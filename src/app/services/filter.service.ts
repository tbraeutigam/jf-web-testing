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
      tags: [],
      matchAll: ['genres', 'tags'],
      matchAny: ['parentalRatings', 'years', 'libraries']
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
        tags: [],
        matchAll: ['genres', 'tags'],
        matchAny: ['parentalRatings', 'years', 'libraries']
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
    
    for (let i in items){
      items[i].show = false;
      if (this.filters[type].status.watched   && !items[i].watched ) continue;
      if (this.filters[type].status.paused    && !items[i].paused  ) continue;
      if (this.filters[type].status.unwatched &&  items[i].watched ) continue;
      if (this.filters[type].status.favorite  && !items[i].favorite) continue;

      let matches = false;

      // *ANY* Matching
      for (let r of this.filters[type].matchAny){
        if (this.filters[type][r] && this.filters[type][r].length  > 0){
          let t = r == 'libraries' ? 'trueParent' : r;
              t = r == 'years' ? 'year' : r;
              t = r == 'parentalRatings' ? 'parentalRating' : r;
          for (let x of this.filters[type][r]){
            if(items[i][t] == x){
              matches = true;
              break;
            }
          }
          if (!matches) break;
        }
          matches = true;
      }
      if (!matches) continue;
      matches = false;

      // Genre Filtering: Need to match *ALL* selected genres
      if (this.filters[type].genres && this.filters[type].genres.length > 0){
        for (let x of this.filters[type].genres){
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

      // Tag Filtering: Need to match *ALL* selected tags
      if (this.filters[type].tags && this.filters[type].tags.length > 0){
        for (let x of this.filters[type].tags){
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
