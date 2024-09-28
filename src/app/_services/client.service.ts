import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import  {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  
  constructor(private http: HttpClient) { }

  /* Endpoint module */

// Conditional Local and production endpoint
private backendurl = environment.url

private endpoint = this.backendurl+'/client';

async create(client: any){
  const body = JSON.stringify({
    firstname: client.firstname,
    lastname: client.lastname,
    phone: client.phone,
    mobile: client.mobile,
    email: client.email,
    rewards: client.rewards,
    membership: client.membership
  });

  const token = localStorage.getItem('token')
  

  const headers = new HttpHeaders({
    'Content-Type': 'application/json', // Indica que estás enviando datos JSON
    'unoweb_authorization': `${token}`
  });
const response = await this.http.post(this.endpoint, body,{headers: headers}).toPromise();
return response;
}

async getAll(){
  const token = localStorage.getItem('token')
  

  const headers = new HttpHeaders({
    'Content-Type': 'application/json', // Indica que estás enviando datos JSON
    'unoweb_authorization': `${token}`
  });

  const response = await this.http.get<{data: any, response: any}>(this.endpoint,{headers:headers}).toPromise();
  return response;

}

async getClient(id:number){
  const token = localStorage.getItem('token')
  

  const headers = new HttpHeaders({
    'Content-Type': 'application/json', // Indica que estás enviando datos JSON
    'unoweb_authorization': `${token}`
  });

  const response = await this.http.get<{data: any, response: any}>(this.endpoint+"/"+id,{headers:headers}).toPromise();
  return response;

}

async update(id:number,client: any){
  const token = localStorage.getItem('token')
  
  const body = JSON.stringify({
    firstname: client.firstname,
    lastname: client.lastname,
    phone: client.phone,
    mobile: client.mobile,
    email: client.email,
    rewards: client.rewards,
    membership: client.membership
  });

  const headers = new HttpHeaders({
    'Content-Type': 'application/json', // Indica que estás enviando datos JSON
    'unoweb_authorization': `${token}`
  });

  const response = await this.http.put<{data: any, message: any}>(this.endpoint+"/"+id,body,{headers:headers}).toPromise();
  return response;

}

async delete(id:number){
  const token = localStorage.getItem('token')
  
  const headers = new HttpHeaders({
    'Content-Type': 'application/json', // Indica que estás enviando datos JSON
    'unoweb_authorization': `${token}`
  });

  const response = await this.http.delete<{data: any, message: any}>(this.endpoint+"/"+id,{headers:headers}).toPromise();
  return response;

}
}



