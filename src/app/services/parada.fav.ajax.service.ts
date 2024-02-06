import { Injectable } from '@angular/core';
import { API_URL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IParadaFav, IParadaFavPage } from '../model/model.interface';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParadaFavAjaxService {
  
  sUrl: string = API_URL + "/parada_fav";
constructor(
  private oHttpClient: HttpClient
  ) { }

  getOne(id: number): Observable<IParadaFav> {
    return this.oHttpClient.get<IParadaFav>(this.sUrl + "/" + id);
}
getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_user: number): Observable<IParadaFavPage> {
  if (!size) size = 10;
  if (!page) page = 0;
  let strUrlUser = "";
  if (id_user > 0) {
      strUrlUser = "&user=" + id_user;
  }
  return this.oHttpClient.get<IParadaFavPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + strUrlUser);
}
removeOne(id: number | undefined): Observable<number> {
  if (id) {
      return this.oHttpClient.delete<number>(this.sUrl + "/" + id);
  } else {
      return new Observable<number>();
  }
}
newOne(oParadaFav: IParadaFav): Observable<IParadaFav> {
  return this.oHttpClient.post<IParadaFav>(this.sUrl, oParadaFav);
}

updateOne(oParadaFav: IParadaFav): Observable<IParadaFav> {
  return this.oHttpClient.put<IParadaFav>(this.sUrl, oParadaFav);
}

generateRandom(amount: number): Observable<number> {
  return this.oHttpClient.post<number>(this.sUrl + "/populate/" + amount, null);
}


empty(): Observable<number> {
  return this.oHttpClient.delete<number>(this.sUrl + "/empty");
}

getParadasFavByUser(id_user: number): Observable<IParadaFav[]> {
  return this.oHttpClient.get<IParadaFav[]>(this.sUrl + "/fav/" + id_user);
}

//todo
checkParadaFavExistsForUser(idParada: number, userId: number): Observable<boolean> {
  const url = `${this.sUrl}/exists?idParada=${idParada}&userId=${userId}`;
  return this.oHttpClient.get<boolean>(url);
}
validateParadaFavExists(idParada: number, userId: number): Observable<boolean> {
  return this.checkParadaFavExistsForUser(idParada, userId)
    .pipe(
      map(result => !!result), // Convertir el resultado en un booleano
      catchError(() => of(false)) // En caso de error, devolver falso
    );
}

}