import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { User } from '../_models'
import { BackendService } from './backend.service';
import { environment } from 'src/environments/environment';
import {UserBD} from '../_models/userBD';


//const APP_USER_PROFILE = "NG_CRM_USER_2.0"
const APP_USER_PROFILE = "Unoweb_Authorization"
const endpoint =  environment.url+"/auth/login"

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private backend: BackendService) { }

  login(user: any) {
    return this.backend.login('token', user)
      .map((response: Response) => {
        // login successful if there's a token in the response
        let data = (<any>response);
        let user = <User>data.user;
        if (user && data.access_token) {
          // store user details and token in local storage to keep user logged in between page refreshes
          user.token = data.access_token;
          user.isAuthenticated = true;
          localStorage.setItem(APP_USER_PROFILE, JSON.stringify(user));
        }
      });
  }

  login2(email: string, password: string){
    return this.http.post(endpoint+"/", {email: email, password: password})
    .map((response: Response) => {
      // login successful if there's a token in the response
     
      let data = (<any>response);
      let user = <UserBD>data.data.user;
      if (user && data.data.access_token) {
        // store user details and token in local storage to keep user logged in between page refreshes
       
        user.token = data.data.access_token;
        user.isAuthenticated = true;
        console.log("user",user)
        localStorage.setItem(APP_USER_PROFILE, JSON.stringify(user));
        localStorage.setItem('token',user.token)
      }
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(APP_USER_PROFILE);
    localStorage.removeItem("token");
  }

  isAuthenticated() {
   // let user =   this.getUser() // <User>JSON.parse(localStorage.getItem(APP_USER_PROFILE));
   let user = this.getUserBD()
    return user && user.isAuthenticated ? true : false;
  }

  getUser(){
    let user = <User>JSON.parse(localStorage.getItem(APP_USER_PROFILE));
    return user;
  }

  getUserBD(){
    let user= <UserBD>JSON.parse(localStorage.getItem(APP_USER_PROFILE));
    return user;
  }

  isLogin(): boolean {
    if(localStorage.getItem('Unoweb-Authorization')){
    const token = localStorage.getItem('Unoweb-Authorization');
    return true
  }
    else{
     return false
    }
   }

}
