import { Injectable, Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { OidcSecurityService, OpenIDImplicitFlowConfiguration } from 'angular-auth-oidc-client';

@Injectable()
export class AuthService implements OnInit, OnDestroy {
    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(public oidcSecurityService: OidcSecurityService,
        private http: Http,
        @Inject('ORIGIN_URL') originUrl: string,
        @Inject('IDENTITY_URL') identityUrl: string
    ) {
        const openIdImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIdImplicitFlowConfiguration.stsServer = identityUrl;
        openIdImplicitFlowConfiguration.redirect_url = originUrl + 'callback';
        openIdImplicitFlowConfiguration.client_id = 'ng';
        openIdImplicitFlowConfiguration.response_type = 'id_token token';
        openIdImplicitFlowConfiguration.scope = 'openid profile apiApp';
        openIdImplicitFlowConfiguration.post_logout_redirect_uri = originUrl + 'home';
        openIdImplicitFlowConfiguration.forbidden_route = '/forbidden';
        openIdImplicitFlowConfiguration.unauthorized_route = '/unauthorized';
        openIdImplicitFlowConfiguration.auto_userinfo = true;
        openIdImplicitFlowConfiguration.log_console_warning_active = true;
        openIdImplicitFlowConfiguration.log_console_debug_active = false;
        openIdImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

        this.oidcSecurityService.setupModule(openIdImplicitFlowConfiguration);

        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.doCallbackLogicIfRequired();
            });
        }
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });
    }

    ngOnDestroy(): void {
        this.isAuthorizedSubscription.unsubscribe();
        this.oidcSecurityService.onModuleSetup.unsubscribe();
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

    private doCallbackLogicIfRequired() {
        if (typeof location !== "undefined" && window.location.hash) {
            this.oidcSecurityService.authorizedCallback();
        }
    }

    get(url: string, options?: RequestOptions): Observable<Response> {
        return this.http.get(url, this.setRequestOptions(options));
    }

    put(url: string, data: any, options?: RequestOptions): Observable<Response> {
        const body = JSON.stringify(data);
        return this.http.put(url, body, this.setRequestOptions(options));
    }

    delete(url: string, options?: RequestOptions): Observable<Response> {
        return this.http.delete(url, this.setRequestOptions(options));
    }

    post(url: string, data: any, options?: RequestOptions): Observable<Response> {
        const body = JSON.stringify(data);
        return this.http.post(url, body, this.setRequestOptions(options));
    }

    private setRequestOptions(options?: RequestOptions | null) {
        if (options) {
            this.appendAuthHeader(options.headers);
        }
        else {
            options = new RequestOptions({ headers: this.getHeaders(), body: "" });
        }
        return options;
    }

    private getHeaders() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.appendAuthHeader(headers);
        return headers;
    }

    private appendAuthHeader(headers?: Headers | null) {

        if (headers == null) headers = this.getHeaders();

        const token = this.oidcSecurityService.getToken();

        if (token == '') return;

        const tokenValue = 'Bearer ' + token;
        headers.append('Authorization', tokenValue);
    }


}