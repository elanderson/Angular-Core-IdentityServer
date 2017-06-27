import { Injectable, Component } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private _authService: AuthService, private _router: Router) { 
    }

    canActivate() {
        if (this._authService._loggedIn) { 
            return true; 
        }
        else{
            this._router.navigate(['unauthorized']);
        }
    }
}