import { Injectable } from '@angular/core';
import { API_URL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IParadaFav, IParadaFavPage } from '../model/model.interface';
import { Observable } from 'rxjs';

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
getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_user: number, strFilter?: string): Observable<IParadaFavPage> {
  let sUrl_filter: string;
  if (!size) size = 10;
  if (!page) page = 0;
  let strUrlUser = "";
  if (id_user > 0) {
      strUrlUser = "&user=" + id_user;
  }
  if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
  } else {
      sUrl_filter = "";
  }
  return this.oHttpClient.get<IParadaFavPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + strUrlUser + sUrl_filter);
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
}
