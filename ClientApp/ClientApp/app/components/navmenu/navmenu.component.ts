import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { GlobalEventsManager } from '../services/global.events.manager'

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {
    public _loggedIn: boolean = false;

    constructor (
      private _authService: AuthService,
      private _globalEventsManager: GlobalEventsManager) {
          _globalEventsManager.showNavBarEmitter.subscribe((mode)=>{
            // mode will be null the first time it is created, so you need to igonore it when null
            if (mode !== null) {
                console.log("Global Event, sent: " + mode);
                this._loggedIn = mode;
            }
        });
  }

  public login(){
      this._authService.startSigninMainWindow();
  }

  public logout(){
      this._authService.startSignoutMainWindow();
  }
}