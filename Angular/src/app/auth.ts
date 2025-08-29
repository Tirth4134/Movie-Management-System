
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class Auth {
  
  
  private baseUrl = "https://localhost:7210/api/Auth";
  private tmdb = "https://localhost:7210/api/Home";

  constructor(private http: HttpClient) {}

isLoggedIn(): boolean {
  return !!localStorage.getItem('token'); 
}

  
  logout() : void{
      localStorage.removeItem('token');
  }

  getMovieById(id: number): Observable<any> {
    return this.http.get(`${this.tmdb}/${id}`);
  }

  login(loginData: any) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, loginData);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  getData(): Observable<any> {
    return this.http.get(`${this.tmdb}`);
  }

  add(data: FormData): Observable<any> {
    return this.http.post(`${this.tmdb}/Add`, data);
  }

  edit(id: any, data: FormData): Observable<any> {
    return this.http.put(`${this.tmdb}/edit/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.tmdb}/delete/${id}`);
  }
}