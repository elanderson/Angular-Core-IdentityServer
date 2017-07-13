import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-unauthorized',
    templateUrl: 'unauthorized.component.html'
})
export class UnauthorizedComponent implements OnInit {

    constructor(private location: Location, private service: AuthService) {

    }

    ngOnInit() {
    }

    login() {
        this.service.startSigninMainWindow();
    }

    goback() {
        this.location.back();
    }
}