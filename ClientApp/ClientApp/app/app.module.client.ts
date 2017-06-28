import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { sharedConfig } from './app.module.shared';

import { AuthService } from './components/services/auth.service';
import { GlobalEventsManager } from './components/services/global.events.manager';
import { AuthGuardService } from './components/services/auth-guard.service';

@NgModule({
    bootstrap: sharedConfig.bootstrap,
    declarations: sharedConfig.declarations,
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ...sharedConfig.imports
    ],
    providers: [
        { provide: 'ORIGIN_URL', useValue: location.origin },
        AuthService, AuthGuardService, GlobalEventsManager 
    ]
})
export class AppModule {
}
