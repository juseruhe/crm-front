import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import  {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(private http: HttpClient) { }

    /* Endpoint module */

 // Conditional Local and production endpoint
 private backendurl = environment.url

 private endpoint = this.backendurl+'/url';

async  sendUrl(url: string){
  try{
   const body = JSON.stringify({url: url})
   const token = localStorage.getItem('token')
   

   const headers = new HttpHeaders({
     'Content-Type': 'application/json', // Indica que estás enviando datos JSON
     'unoweb_authorization': `${token}`
   });
  
  const response = await this.http.post(this.endpoint,body,{headers:headers}).toPromise()
  return response
  }catch(err){
    throw err;
  }
  }

 async sendUrls(urls: any[]){
   const body = JSON.stringify({urls: urls})
   const token = localStorage.getItem('token')
   const headers = new HttpHeaders({
     'Content-Type': 'application/json', // Indica que estás enviando datos JSON
       'unoweb_authorization': `${token}`
   });
  return await this.http.post<{results: any}>(this.endpoint+"/urls",body,{headers:headers}).toPromise()
  }


 async getUrls(){
    const token = localStorage.getItem('token')
    
   const headers = new HttpHeaders({
     'Content-Type': 'application/json', // Indica que estás enviando datos JSON
       'unoweb_authorization': `${token}`
   });
   return await this.http.get<{results: any}>(this.endpoint+"/getUrls",{headers: headers}).toPromise()
  }


 async addUrl(url: string) {
    const token = localStorage.getItem('token')
   const body = JSON.stringify({url: url});
   const headers = new HttpHeaders({
     'Content-Type': 'application/json', // Indica que estás enviando datos JSON
       'unoweb_authorization': `${token}`
   });
   return await this.http.post<{result: any}>(this.endpoint+"/addUrl",body,{headers: headers}).toPromise()
  }

 async deleteUrl(id: number){

    const token = localStorage.getItem('token')
   const headers = new HttpHeaders({
     'Content-Type': 'application/json', // Indica que estás enviando datos JSON
       'unoweb_authorization': `${token}`
   });
   return await this.http.delete<{result: any}>(this.endpoint+"/deleteUrl/"+id,{headers: headers}).toPromise()
  }

async editUrl(id: number, url: string){
    const token = localStorage.getItem('token')
   const body = {url: url}
   const headers = new HttpHeaders({
     'Content-Type': 'application/json', // Indica que estás enviando datos JSON
       'unoweb_authorization': `${token}`
   });
   return await this.http.put<{result: any}>(this.endpoint+"/editUrl/"+id,body,{headers: headers}).toPromise()
  }
}
