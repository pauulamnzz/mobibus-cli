import { Injectable } from '@angular/core';
import { API_EMT, API_KEY } from '../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Result, Root } from '../model/model.interface';
import { SessionAjaxService } from './session.ajax.service';

@Injectable({
  providedIn: 'root'
})
export class ApiEmtService {

  private apiUrl: string = API_EMT;
private apiKey: string= API_KEY
  constructor(
    private oHttpClient: HttpClient,
  private oSessionAjaxService: SessionAjaxService) 
    { }


  // Método para obtener datos de la API
  getEmtData(): Observable<any> {
    return this.oHttpClient.get(this.apiUrl);
  }

/*   getEmtData(): Observable<any> {
    const headers = this.oSessionAjaxService.getHeaders();
    return this.oHttpClient.get(this.apiUrl, { headers });
  } */








  // Método para obtener toda la info de la EMT PAGINADA
  getAll(): Observable<Result[]> {
    const apiUrl = 'https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/emt/records?limit=100';
    const totalResults = 1129; // Total de resultados
    const requestsPerPage = 100; // Resultados por página
    const totalPages = Math.ceil(totalResults / requestsPerPage); // Total de páginas
  
    // Crea un array de observables, uno para cada página
    const observables = Array.from({ length: totalPages }, (_, i) =>
      this.oHttpClient.get<Root>(`${apiUrl}&start=${i * requestsPerPage + 1}`)
    );
  
    // Combina todos los observables en uno
    return forkJoin(observables).pipe(
      map((responses: any[]) => {
        // Combina todos los resultados en un solo array
        return ([] as Result[]).concat(...responses.map(response => response.results));
      })
    );
  }

  // Método para obtener todas las líneas de la EMT PAGINADAS
  getAllLineas(): Observable<string[]> {
    const apiUrl = 'https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/emt/records?select=lineas&limit=100';
    const totalResults = 1129; // Total de resultados
    const requestsPerPage = 100; // Resultados por página
    const totalPages = Math.ceil(totalResults / requestsPerPage); // Total de páginas
  
    // Crea un array de observables, uno para cada página
    const observables = Array.from({ length: totalPages }, (_, i) =>
      this.oHttpClient.get<Root>(`${apiUrl}&start=${i * requestsPerPage + 1}`)
    );
  
    // Combina todos los observables en uno
    return forkJoin(observables).pipe(
      map((responses: any[]) => {
        // Combina todos los resultados en un solo array
        let results = ([] as Result[]).concat(...responses.map(response => response.results));
        
        // Aplana el array y elimina los duplicados
        let lineasUnicas = [...new Set(results.flatMap(result => result.lineas.split(',')))];
    
        return lineasUnicas;
      })
    );
  }
}
