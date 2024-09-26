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
  const body = JSON.stringify({client})
  const token = localStorage.getItem('token')
  

  const headers = new HttpHeaders({
    'Content-Type': 'application/json', // Indica que estás enviando datos JSON
    'unoweb_authorization': `${token}`
  });
const response = await this.http.post(this.endpoint, body,{headers: headers})
return response;
}
}

