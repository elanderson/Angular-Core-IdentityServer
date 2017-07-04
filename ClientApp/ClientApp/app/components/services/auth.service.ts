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
  public _loggedIn: boolean = false;
  _mgr: UserManager;
  _userLoadedEvent: EventEmitter<User> = new EventEmitter<User>();
  _currentUser: User;
  _authHeaders: Headers;

  constructor(
    private http:Http,
    private _router: Router,
    private _globalEventsManager: GlobalEventsManager) {
    if (typeof window !== 'undefined') {
      //instance needs to be created within the if clause
      //otherwise you'll get a sessionStorage not defined error.
        this._mgr = new UserManager(settings);
        this._mgr
        .getUser()
        .then((user) => {
            if (user) {
                this._currentUser = user;
                this._userLoadedEvent.emit(user);
            }
        })
        .catch((err) => {
          console.log(err);
        });
        this._mgr.events.addUserUnloaded((e) => {
            //if (!environment.production) {
                console.log("user unloaded");
            //}
        });
    }
  }
  clearState() {
      this._mgr.clearStaleState().then(function () {
        console.log("clearStateState success");
      }).catch(function (e) {
        console.log("clearStateState error", e.message);
      });
  }

  getUser() {
      this._mgr.getUser().then((user) => {
        console.log("got user");
        this._userLoadedEvent.emit(user);
      }).catch(function (err) {
        console.log(err);
      });
  }

  removeUser() {
      this._mgr.removeUser().then(() => {
        this._userLoadedEvent.emit(null);
        console.log("user removed");
      }).catch(function (err) {
        console.log(err);
      });
  }

  startSigninMainWindow() {
      this._mgr.signinRedirect({ data: 'some data' }).then(function () {
        console.log("signinRedirect done");
      }).catch(function (err) {
        console.log(err);
      });
  }

  endSigninMainWindow() {
      //TODO: Validate why in a promise a global variable is not accessible,
      //      instead a method scope variable is required so it can be used within
      //      the promise.
      //Answer: the previous code was using function (user) { } instead of just (user) =>
      //        because is a function that only has one parameter (user) that explains
      //        why the other variables were undefined, the fix was to use an anonymous function
      //        a lambda expression.

      //TODO: Validate why even though _mgr has already been instantiated, I need to enclose
      //      the call in !== undefined, removing the if clause results in a failure of _mgr
      //      is undefined
      if (typeof window !== 'undefined') {
        this._mgr.signinRedirectCallback().then((user) => {
          console.log("signed in");
          this._loggedIn = true;
           this._globalEventsManager.showNavBar(this._loggedIn);
          this._router.navigate(['home']);
        }).catch(function (err) {
          console.log(err);
        });
      }
  }

  startSignoutMainWindow() {
      this._mgr.signoutRedirect().then(function (resp) {
        console.log("signed out", resp);
        setTimeout(5000, () => {
          console.log("testing to see if fired...");

        })
      }).catch(function (err) {
        console.log(err);
      });
  };

  endSignoutMainWindow() {
      this._mgr.signoutRedirectCallback().then(function (resp) {
        console.log("signed out", resp);
      }).catch(function (err) {
        console.log(err);
      });
  };
  /**
   * Example of how you can make auth request using angulars http methods.
   * @param options if options are not supplied the default content type is application/json
   */
  AuthGet(url: string, options?: RequestOptions): Observable<Response> {
      if (options) {
        options = this._setRequestOptions(options);
      }
      else {
        options = this._setRequestOptions();
      }
      return this.http.get(url, options);
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {
      let body = JSON.stringify(data);

      if (options) {
        options = this._setRequestOptions(options);
      }
      else {
        options = this._setRequestOptions();
      }
      return this.http.put(url, body, options);
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthDelete(url: string, options?: RequestOptions): Observable<Response> {
      if (options) {
        options = this._setRequestOptions(options);
      }
      else {
        options = this._setRequestOptions();
      }
      return this.http.delete(url, options);
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {
      let body = JSON.stringify(data);

      if (options) {
        options = this._setRequestOptions(options);
      }
      else {
        options = this._setRequestOptions();
      }
      return this.http.post(url, body, options);
  }


  private _setAuthHeaders(user: User) {
      this._authHeaders = new Headers();
      this._authHeaders.append('Authorization', user.token_type + " " + user.access_token);
      this._authHeaders.append('Content-Type', 'application/json');
  }
  private _setRequestOptions(options?: RequestOptions) {
      if (options) {
        options.headers.append(this._authHeaders.keys[0], this._authHeaders.values[0]);
      }
      else {
        //setting default authentication headers
        this._setAuthHeaders(this._currentUser);
        options = new RequestOptions({ headers: this._authHeaders, body: "" });
      }
      return options;
  }
}