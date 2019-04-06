import { Injectable } from '@angular/core';
import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filters = {};

  public listItems = {};


  public getFilters(type: string) {
    return this.filters[type];
  }

  public setFilters(xtype: string, provided: any) {
    this.filters[xtype] = provided;
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

  public resetFilters(type: string, defaultFilters: {}) {
    this.filters[type] = defaultFilters;
    if (this.filters[type] == defaultFilters) return true;
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
      for (let filterCategory of this.filters[type].matchAny){
        matches = false;

        let f = this.filters[type][filterCategory];

        if(f && f.length > 0){
          let t: string;
          switch (filterCategory){
            case 'libraries'      : t = 'trueParent'; break;
            case 'years'          : t = 'year'; break;
            case 'parentalRatings': t = 'parentalRating'; break;
          }

          for (let entry of f){
            if (items[i][t] == entry){
              matches = true;
              break;
            }
          }
        } else{
          matches = true;
        }
        if (!matches) break;
      }
      if (!matches) continue;

      // *ALL* Filtering
      for (let r of this.filters[type].matchAll){
        matches = false;
        if (this.filters[type][r] && this.filters[type][r].length > 0){
          for (let x of this.filters[type][r]){
            if (!items[i][r].includes(x)){
              matches = false;
              break
            }
            else {
              matches = true;
            }
          }
        }
        else{
          matches = true;
        }
        if (!matches) break;
      }
      if (!matches) continue;
      items[i].show = true;
    }
    return items;
  }
  
  constructor() { }
}
