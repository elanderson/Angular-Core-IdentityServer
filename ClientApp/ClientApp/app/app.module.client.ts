import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { sharedConfig } from './app.module.shared';

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
        { provide: 'API_URL', useValue: "http://localhost:5001/api/" },
        ...sharedConfig.providers
    ]
})
export class AppModule {
}
