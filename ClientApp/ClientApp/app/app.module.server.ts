import { NgModule, Inject } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModuleShared } from './app.module.shared';
import { AppComponent } from './components/app/app.component';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        ServerModule,
        AppModuleShared
    ],
    providers: [
        { provide: 'ORIGIN_URL', useValue: APP_BASE_HREF },
        AppModuleShared
    ]
})
export class AppModule {
}
