import { Injectable, Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { OidcSecurityService, OpenIDImplicitFlowConfiguration } from 'angular-auth-oidc-client';

@Injectable()
export class AuthService implements OnInit, OnDestroy {
    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(public oidcSecurityService: OidcSecurityService,
        private http: Http) {

        const openIdImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIdImplicitFlowConfiguration.stsServer = 'http://localhost:5000';

        openIdImplicitFlowConfiguration.redirect_url = 'http://localhost:5002/callback';
        // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
        // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
        openIdImplicitFlowConfiguration.client_id = 'ng';
        openIdImplicitFlowConfiguration.response_type = 'id_token token';
        openIdImplicitFlowConfiguration.scope = 'openid profile apiApp';
        openIdImplicitFlowConfiguration.post_logout_redirect_uri = 'http://localhost:5002/home';
        openIdImplicitFlowConfiguration.start_checksession = true;
        openIdImplicitFlowConfiguration.silent_renew = true;
        openIdImplicitFlowConfiguration.startup_route = '/home';
        // HTTP 403
        openIdImplicitFlowConfiguration.forbidden_route = '/forbidden';
        // HTTP 401
        openIdImplicitFlowConfiguration.unauthorized_route = '/unauthorized';
        openIdImplicitFlowConfiguration.log_console_warning_active = true;
        openIdImplicitFlowConfiguration.log_console_debug_active = false;
        // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
        // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
        openIdImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

        this.oidcSecurityService.setupModule(openIdImplicitFlowConfiguration);
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

    authorizedCallback() {
        this.oidcSecurityService.authorizedCallback();
    }

    getIsAuthorized(): Observable<boolean> {
        return this.oidcSecurityService.getIsAuthorized();
    }

    login() {
        console.log('start login');
        this.oidcSecurityService.authorize();
    }

    refreshSession() {
        console.log('start refreshSession');
        this.oidcSecurityService.authorize();
    }

    logout() {
        console.log('start logoff');
        this.oidcSecurityService.logoff();
    }

    get(url: string, options?: RequestOptions): Observable<Response> {
        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.get(url, options);
    }

    put(url: string, data: any, options?: RequestOptions): Observable<Response> {
        let body = JSON.stringify(data);

        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.put(url, body, options);
    }

    delete(url: string, options?: RequestOptions): Observable<Response> {
        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.delete(url, options);
    }

    post(url: string, data: any, options?: RequestOptions): Observable<Response> {
        let body = JSON.stringify(data);

        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.post(url, body, options);
    }

    private setRequestOptions(options?: RequestOptions) {
        if (options) {
            this.appendAuthHeader(options.headers);
        }
        else {
            options = new RequestOptions({ headers: this.getHeaders(), body: "" });
        }
        return options;
    }

    private getHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.appendAuthHeader(headers);
        return headers;
    }

    private appendAuthHeader(headers: Headers) {
        const token = this.oidcSecurityService.getToken();

        if (token == '') return;

        const tokenValue = 'Bearer ' + token;
        headers.append('Authorization', tokenValue);
    }


}