import { Injectable, Component } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate() {
        if (this.authService.loggedIn) {
            return true;
        }
        else {
            this.router.navigate(['unauthorized']);
        }
    }
}