import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(public oidcSecurityService: OidcSecurityService) {

    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });

        if (window.location.hash) {
            this.oidcSecurityService.authorizedCallback();
        }
    }

    ngOnDestroy(): void {
        this.isAuthorizedSubscription.unsubscribe();
    }

    public login() {
        console.log('start login');
        this.oidcSecurityService.authorize();
    }

    public refreshSession() {
        console.log('start refreshSession');
        this.oidcSecurityService.authorize();
    }

    public logout() {
        console.log('start logoff');
        this.oidcSecurityService.logoff();
    }
}