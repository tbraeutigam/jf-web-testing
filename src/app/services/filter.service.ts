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
      switch(subtype){
        case 'favorite':
          this.filters[type].status.favorite = !this.filters[type].status.favorite;
          break;
        case 'paused':
          this.filters[type].status.paused = !this.filters[type].status.paused;
          break;
        case 'watched':
          this.filters[type].status.watched = !this.filters[type].status.watched;
          break;
        case 'unwatched':
          this.filters[type].status.unwatched = !this.filters[type].status.unwatched;
          break;
      }
    }
    else {
      switch (group) {
        case 'library':
            if (!this.filters[type].libraries.includes(subtype)){
              this.filters[type].libraries.push(subtype);
            }
            else {
              let index = this.filters[type].libraries.indexOf(subtype, 0);
              if (index > -1) this.filters[type].libraries.splice(index, 1);
            }
          break;
        case 'genres':
            if (!this.filters[type].genres.includes(subtype)){
              this.filters[type].genres.push(subtype);
            }
            else {
              let index = this.filters[type].genres.indexOf(subtype, 0);
              if (index > -1) this.filters[type].genres.splice(index, 1);
            }
          break;
        case 'parentalRatings':
            if (!this.filters[type].parentalRatings.includes(subtype)){
              this.filters[type].parentalRatings.push(subtype);
            }
            else {
              let index = this.filters[type].parentalRatings.indexOf(subtype, 0);
              if (index > -1) this.filters[type].parentalRatings.splice(index, 1);
            }
          break;
        case 'years':
            if (!this.filters[type].years.includes(subtype)){
              this.filters[type].years.push(subtype);
            }
            else {
              let index = this.filters[type].years.indexOf(subtype, 0);
              if (index > -1) this.filters[type].years.splice(index, 1);
            }
          break;
        case 'tags':
            if (!this.filters[type].tags.includes(subtype)){
              this.filters[type].tags.push(subtype);
            }
            else {
              let index = this.filters[type].tags.indexOf(subtype, 0);
              if (index > -1) this.filters[type].tags.splice(index, 1);
            }
          break;
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
