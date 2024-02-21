import { Injectable } from '@angular/core';
import { API_EMT, API_KEY } from '../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { IProxLlegada, IResultApi, IRoot } from '../model/model.interface';
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

  // Método para obtener todas las líneas de la EMT PAGINADAS
  getAllLineas(): Observable<string[]> {
    const apiUrl = 'https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/emt/records?select=lineas&limit=100';
    const totalResults = 1129; // Total de resultados
    const requestsPerPage = 100; // Resultados por página
    const totalPages = Math.ceil(totalResults / requestsPerPage); // Total de páginas
  
    // Crea un array de observables, uno para cada página
    const observables = Array.from({ length: totalPages }, (_, i) =>
      this.oHttpClient.get<IRoot>(`${apiUrl}&start=${i * requestsPerPage + 1}`)
    );
  
    // Combina todos los observables en uno
    return forkJoin(observables).pipe(
      map((responses: any[]) => {
        // Combina todos los resultados en un solo array
        let results = ([] as IResultApi[]).concat(...responses.map(response => response.results));
        
        // Aplana el array y elimina los duplicados
        let lineasUnicas = [...new Set(results.flatMap(result => result.lineas.split(',')))];
    
        return lineasUnicas;
      })
    );
  }



  //ORDENADO
  // getAllLineas(): Observable<string[]> {
  //   const apiUrl = 'https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/emt/records?select=lineas&limit=100';
  //   const totalResults = 1129; // Total de resultados
  //   const requestsPerPage = 100; // Resultados por página
  //   const totalPages = Math.ceil(totalResults / requestsPerPage); // Total de páginas

  //   // Crea un array de observables, uno para cada página
  //   const observables = Array.from({ length: totalPages }, (_, i) =>
  //     this.oHttpClient.get<IRoot>(`${apiUrl}&start=${i * requestsPerPage + 1}`)
  //   );

  //   // Combina todos los observables en uno
  //   return forkJoin(observables).pipe(
  //     map((responses: any[]) => {
  //       // Combina todos los resultados en un solo array
  //       let results = ([] as IResultApi[]).concat(...responses.map(response => response.results));

  //       // Aplana el array y elimina los duplicados
  //       let lineasUnicas = [...new Set(results.flatMap(result => result.lineas.split(',')))];

  //       // Ordena los resultados de mayor a menor
  //       lineasUnicas.sort((a, b) => parseFloat(b) - parseFloat(a));

  //       return lineasUnicas;
  //     })
  //   );
  // }


  //ORDENAO
  // getAllParadas(): Observable<IResultApi[]> {
  //   const apiUrl = 'https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/emt/records';
  //   const orderBy = 'id_parada ASC'; // Ordenar por ID de parada ascendente
  //   const limit = 100; // Resultados por página
  //   const totalResults = 1129; // Total de resultados
  //   const totalPages = Math.ceil(totalResults / limit); // Total de páginas

  //   // Crea un array de observables, uno para cada página
  //   const observables = Array.from({ length: totalPages }, (_, i) =>
  //     this.oHttpClient.get<IRoot>(`${apiUrl}?order_by=${orderBy}&limit=${limit}&start=${i * limit + 1}`)
  //   );

  //   // Combina todos los observables en uno
  //   return forkJoin(observables).pipe(
  //     map((responses: any[]) => {
  //       // Combina todos los resultados en un solo array
  //       return ([] as IResultApi[]).concat(...responses.map(response => response.results));
  //     })
  //   );
  // }
getAllParadas(): Observable<IResultApi[]> {
  const apiUrl = 'https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/emt/records?order_by=id_parada%20ASC&limit=100';
  const totalResults = 1129; // Total de resultados
  const requestsPerPage = 100; // Resultados por página
  const totalPages = Math.ceil(totalResults / requestsPerPage); // Total de páginas

  // Crea un array de observables, uno para cada página
  const observables = Array.from({ length: totalPages }, (_, i) =>
    this.oHttpClient.get<IRoot>(`${apiUrl}&start=${i * requestsPerPage + 1}`)
  );

  // Combina todos los observables en uno
  return forkJoin(observables).pipe(
    map((responses: any[]) => {
      // Combina todos los resultados en un solo array
      return ([] as IResultApi[]).concat(...responses.map(response => response.results));
    })
  );
}

getOneParada(paradaId: number): Observable<any> {
  const apiUrl = `${this.apiUrl}?where=id_parada=${paradaId}&limit=1`;
  return this.oHttpClient.get(apiUrl);
}

getInfoLlegadas(id: number): Observable<IProxLlegada[]> { 
  const apiUrl = `http://localhost:8083/api/data?id=${id}`; 
  return this.oHttpClient.get<IProxLlegada[]>(apiUrl);
}

}