import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
 // Asegúrate de tener esta interfaz creada
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.url}/user`;  // Actualiza la URL para 'user'

  constructor(private http: HttpClient) { }

  // Método para obtener todos los usuarios
  getUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token is missing from localStorage');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'unoweb_authorization': token ? token : ''
    });

    return this.http.get<any>(this.apiUrl, { headers: headers });
  }

  // Método para obtener un usuario por su ID
  getUserById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'unoweb_authorization': token ? token : ''
    });

    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  // Método para eliminar un usuario por su ID
  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'unoweb_authorization': token ? token : ''
    });

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  // Método para actualizar un usuario
  updateUser(id: number, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'unoweb_authorization': token ? token : ''
    });

    return this.http.put<any>(`${this.apiUrl}/${id}`, userData, { headers: headers });
  }

  // Método para crear un nuevo usuario
  createUser(userData: User): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'unoweb_authorization': token ? token : ''
    });

    return this.http.post<any>(this.apiUrl, userData, { headers: headers });
  }
}
