import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

import { AuthModule, OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from './components/services/auth.service';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        UnauthorizedComponent
    ],
    imports: [
        AuthModule.forRoot(),
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'unauthorized', component: UnauthorizedComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        AuthService,
        OidcSecurityService,
        { provide: 'ORIGIN_URL', useFactory: getBaseUrl },
        { provide: 'API_URL', useFactory: getApiUrl }
    ]
})
export class AppModuleShared {
}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

export function getApiUrl() {
    return "http://localhost:5001/api/";
}
