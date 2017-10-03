import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppModuleShared } from './app.module.shared';
import { AppComponent } from './components/app/app.component';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppModuleShared
    ],
    providers: [
        { provide: 'ORIGIN_URL', useFactory: getBaseUrl },
        { provide: 'API_URL', useFactory: apiUrlFactory },
        { provide: 'IDENTITY_URL', useFactory: identityUrlFactory },
        AppModuleShared
    ]
})
export class AppModule {
}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

export function apiUrlFactory() {
    return (window as any).url_Config.apiUrl;
}

export function identityUrlFactory() {
    return (window as any).url_Config.identityUrl;
}