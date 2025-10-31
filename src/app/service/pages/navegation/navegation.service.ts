import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private fromMenu = false;

  setFromMenu(value: boolean) {
    this.fromMenu = value;
  }

  getFromMenu(): boolean {
    return this.fromMenu;
  }
}
