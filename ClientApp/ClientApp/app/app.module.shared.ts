import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { CallbackComponent } from './components/callback/callback.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

import { AuthService } from './components/services/auth.service';
import { GlobalEventsManager } from './components/services/global.events.manager';
import { AuthGuardService } from './components/services/auth-guard.service';

import { AuthModule, OpenIDImplicitFlowConfiguration, OidcSecurityService } from 'angular-auth-oidc-client';

export const sharedConfig: NgModule = {
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        CallbackComponent,
        UnauthorizedComponent
    ],
    imports: [
        AuthModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'callback', component: CallbackComponent },
            { path: 'unauthorized', component: UnauthorizedComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent, canActivate:[AuthGuardService]  },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [AuthService, AuthGuardService, GlobalEventsManager, OidcSecurityService ]
};
