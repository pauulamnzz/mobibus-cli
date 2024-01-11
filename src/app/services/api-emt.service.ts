import { Injectable } from '@angular/core';
import { API_URL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiEmtService {

  private apiUrl: string = API_URL;

  constructor(private oHttpClient: HttpClient) { }
  // Método para obtener datos de la API
  getEmtData(): Observable<any> {
    return this.oHttpClient.get(this.apiUrl);
  }
}
