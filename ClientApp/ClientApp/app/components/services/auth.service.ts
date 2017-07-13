import { Injectable, EventEmitter, Component } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Router } from "@angular/router";
import { UserManager, Log, MetadataService, User } from 'oidc-client';
import { GlobalEventsManager } from './global.events.manager';

const settings: any = {
    authority: 'http://localhost:5000',
    client_id: 'ng',
    redirect_uri: 'http://localhost:5002/callback',
    post_logout_redirect_uri: 'http://localhost:5002/home',
    response_type: 'id_token token',
    scope: 'openid profile apiApp',

    silent_redirect_uri: 'http://localhost:5002/silent-renew.html',
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTime: 4,
    // silentRequestTimeout:10000,

    filterProtocolClaims: true,
    loadUserInfo: true
};

@Injectable()
export class AuthService {
    loggedIn = false;
    mgr: UserManager;
    userLoadedEvent = new EventEmitter<User>();
    currentUser: User;
    authHeaders: Headers;

    constructor(
        private http: Http,
        private router: Router,
        private globalEventsManager: GlobalEventsManager) {
        if (typeof window !== 'undefined') {
            //instance needs to be created within the if clause
            //otherwise you'll get a sessionStorage not defined error.
            this.mgr = new UserManager(settings);
            this.mgr
                .getUser()
                .then((user) => {
                    if (user) {
                        this.currentUser = user;
                        this.userLoadedEvent.emit(user);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            this.mgr.events.addUserUnloaded((e) => {
                //if (!environment.production) {
                console.log("user unloaded");
                //}
            });
        }
    }

    clearState() {
        this.mgr.clearStaleState().then(() => {
            console.log('clearStateState success');
        }).catch(e => {
            console.log('clearStateState error', e.message);
        });
    }

    getUser() {
        this.mgr.getUser().then((user) => {
            console.log("got user");
            this.userLoadedEvent.emit(user);
        }).catch(err => {
            console.log(err);
        });
    }

    removeUser() {
        this.mgr.removeUser().then(() => {
            this.userLoadedEvent.emit(null);
            console.log("user removed");
        }).catch(err => {
            console.log(err);
        });
    }

    startSigninMainWindow() {
        this.mgr.signinRedirect({ data: 'some data' }).then(() => {
            console.log("signinRedirect done");
        }).catch(err => {
            console.log(err);
        });
    }

    endSigninMainWindow() {
        if (typeof window !== 'undefined') {
            this.mgr.signinRedirectCallback().then((user) => {
                console.log("signed in");
                this.loggedIn = true;
                this.globalEventsManager.showNavBar(this.loggedIn);
                this.router.navigate(['home']);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    startSignoutMainWindow() {
        this.mgr.signoutRedirect().then(resp => {
            console.log("signed out", resp);
            setTimeout(5000, () => {
                console.log("testing to see if fired...");

            });
        }).catch(err => {
            console.log(err);
        });
    };

    endSignoutMainWindow() {
        this.mgr.signoutRedirectCallback().then(resp => {
            console.log("signed out", resp);
        }).catch(err => {
            console.log(err);
        });
    };

    /**
     * Example of how you can make auth request using angulars http methods.
     * @param options if options are not supplied the default content type is application/json
     */
    AuthGet(url: string, options?: RequestOptions): Observable<Response> {
        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.get(url, options);
    }

    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {
        let body = JSON.stringify(data);

        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.put(url, body, options);
    }

    /**
     * @param options if options are not supplied the default content type is application/json
     */

    AuthDelete(url: string, options?: RequestOptions): Observable<Response> {
        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.delete(url, options);
    }

    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {
        let body = JSON.stringify(data);

        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.post(url, body, options);
    }


    private setAuthHeaders(user: User) {
        this.authHeaders = new Headers();
        this.authHeaders.append('Authorization', user.token_type + " " + user.access_token);
        this.authHeaders.append('Content-Type', 'application/json');
    }

    private setRequestOptions(options?: RequestOptions) {
        if (options) {
            options.headers.append(this.authHeaders.keys[0], this.authHeaders.values[0]);
        }
        else {
            //setting default authentication headers
            this.setAuthHeaders(this.currentUser);
            options = new RequestOptions({ headers: this.authHeaders, body: "" });
        }
        return options;
    }
}