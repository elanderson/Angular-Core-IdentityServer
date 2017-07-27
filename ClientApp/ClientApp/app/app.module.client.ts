import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { sharedConfig } from './app.module.shared';
import { AuthModule, OpenIDImplicitFlowConfiguration, OidcSecurityService } from 'angular-auth-oidc-client';

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
    constructor(public oidcSecurityService: OidcSecurityService) {

        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer = 'http://localhost:5000';

        openIDImplicitFlowConfiguration.redirect_url = 'http://localhost:5002/callback';
        // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
        // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
        openIDImplicitFlowConfiguration.client_id = 'ng';
        openIDImplicitFlowConfiguration.response_type = 'id_token token';
        openIDImplicitFlowConfiguration.scope = 'openid profile apiApp';
        openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'http://localhost:5002/home';
        openIDImplicitFlowConfiguration.start_checksession = true;
        openIDImplicitFlowConfiguration.silent_renew = true;
        openIDImplicitFlowConfiguration.startup_route = '/home';
        // HTTP 403
        openIDImplicitFlowConfiguration.forbidden_route = '/forbidden';
        // HTTP 401
        openIDImplicitFlowConfiguration.unauthorized_route = '/unauthorized';
        openIDImplicitFlowConfiguration.log_console_warning_active = true;
        openIDImplicitFlowConfiguration.log_console_debug_active = false;
        // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
        // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

        this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);
    }
}
