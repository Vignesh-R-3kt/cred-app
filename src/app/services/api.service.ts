import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private endURL: string = "http://localhost:3000/userData";
  private header: any = { headers: { 'Content-Type': 'application/json' } };

  constructor(private http: HttpClient) { }

  fetchAllData(): Observable<any> {
    return this.http.get(this.endURL);
  }

  sendNewBlockData(data: any): Observable<any> {
    return this.http.post(this.endURL, JSON.stringify(data), this.header);
  }

  patchNewData(data: any, id: number): Observable<any> {
    return this.http.put(`${this.endURL}/${id}`, JSON.stringify(data), this.header)
  }

  deleteCard(id: number): Observable<any> {
    return this.http.delete(`${this.endURL}/${id}`);
  }
}
