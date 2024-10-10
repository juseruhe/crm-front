import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/app/interface/client.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientService {


  
  private apiUrl = `${environment.url}/client`;

  constructor(private http: HttpClient) { }



  // Método para obtener todos los clientes
  getClients(): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Indica que estás enviando datos JSON
      'unoweb_authorization': `${token}`
    });
    return this.http.get<any>(this.apiUrl,{headers: headers});
  }

  getClientById(id: number): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Indica que estás enviando datos JSON
      'unoweb_authorization': `${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`,{headers: headers}); 
  }

  deleteClient(id: number): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Indica que estás enviando datos JSON
      'unoweb_authorization': `${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`,{headers: headers});
  }

  updateClient(id: number, clientData: any): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Indica que estás enviando datos JSON
      'unoweb_authorization': `${token}`
    });
    return this.http.put(`${this.apiUrl}/${id}`, clientData, {headers: headers});
  }

  createClient(clientData: Client): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Indica que estás enviando datos JSON
      'unoweb_authorization': `${token}`
    });
    return this.http.post<any>(this.apiUrl, clientData,{headers: headers});
  }



}
