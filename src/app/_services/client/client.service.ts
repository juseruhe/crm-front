import { HttpClient } from '@angular/common/http';
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
    return this.http.get<any>(this.apiUrl);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`); 
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateClient(id: number, clientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, clientData);
  }

  createClient(clientData: Client): Observable<any> {
    return this.http.post<any>(this.apiUrl, clientData);
  }



}
