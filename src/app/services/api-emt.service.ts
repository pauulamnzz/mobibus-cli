import { Injectable } from '@angular/core';
import { API_EMT } from '../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Result, Root } from '../model/model.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiEmtService {

  private apiUrl: string = API_EMT;

  constructor(private oHttpClient: HttpClient) { }


  // Método para obtener datos de la API
  getEmtData(): Observable<any> {
    return this.oHttpClient.get(this.apiUrl);
  }

// Método para obtener lineas datos de la API SOLO 100
   getLineas(): Observable<Result[]> {
     const apiUrl ='https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/emt/records?select=lineas&limit=100';

     return this.oHttpClient.get<Root>(apiUrl).pipe(
       map(({results}) => results)
     );
   }


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
  
     // Crear las cabeceras con la clave de API
     const headers = new HttpHeaders({
      'apikey': 'mobibus',
      // otras cabeceras si es necesario
    });
    
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
