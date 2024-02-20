import { Injectable } from '@angular/core';
import { API_KEY, API_URL } from '../environment/environment';
import { IToken, IUser, SessionEvent } from '../model/model.interface';
import { Observable, Subject, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserAjaxService } from './user.ajax.service';
@Injectable({
  
  providedIn: 'root',
 
})
export class SessionAjaxService {

  sUrl: string = API_URL + "/session";
  private apiKey: string = API_KEY;  // Agrega la API_KEY
  
//evento logout
  private sessionEventSubject = new Subject<string>();
  sessionEvent$ = this.sessionEventSubject.asObservable();

  subjectSession = new Subject<SessionEvent>();
  constructor(
    private oHttpClient: HttpClient,
    private oUserAjaxService: UserAjaxService
) { }

private parseJwt(token: string): IToken {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
login(sUsername: string, sPassword: string): Observable<string> {
  //const sUser: string = JSON.stringify({ username: sUsername, password: sPassword });
  return this.oHttpClient.post<string>(this.sUrl, { username: sUsername, password: sPassword });        
}

setToken(sToken: string): void {
  //evento logout
  localStorage.setItem('token', sToken);        
}

getToken(): string | null {
  return localStorage.getItem('token');
}

logout(): void {
  localStorage.removeItem('token');    
  this.sessionEventSubject.next('logout');    
}
isSessionActive(): Boolean {
  let strToken: string | null = localStorage.getItem('token');
  if (strToken) {
      let oDecodedToken: IToken = this.parseJwt(strToken);
      if (Date.now() >= oDecodedToken.exp * 1000) {                
          return false;                
      } else {                
          return true;
      }
  } else {        
      return false;
  }
}

getUsername(): string {
  if (this.isSessionActive()) {
      let token: string | null = localStorage.getItem('token');
      if (!token) {
          return "";
      } else {
          return this.parseJwt(token).name;
      }
  } else {
      return "";
  }
}

on(): Observable<SessionEvent> {
  return this.subjectSession.asObservable();
}

emit(event: SessionEvent) {
  this.subjectSession.next(event);
}

getSessionUser(): Observable<IUser> | null {
  if (this.isSessionActive()) {
      return this.oUserAjaxService.getByUsername(this.getUsername())
  } else {
      return null;
  }
}
getSessionUserId():Observable<number | null>{
  if(this.isSessionActive() && this.getUsername()){
    return this.oUserAjaxService.getUsuarioIdByUsername(this.getUsername());
  }else{
return of(null);
  }
  }



} 

