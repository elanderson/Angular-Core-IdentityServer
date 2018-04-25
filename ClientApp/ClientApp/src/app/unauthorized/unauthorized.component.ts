import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-unauthorized',
    templateUrl: 'unauthorized.component.html'
})
export class UnauthorizedComponent implements OnInit {

    constructor(private location: Location) {

    }

    ngOnInit() {
    }

    login() {
        //this.service.startSigninMainWindow();
    }

    goback() {
        this.location.back();
    }
}