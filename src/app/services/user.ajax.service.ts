import { Injectable } from '@angular/core';
import { API_URL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IUser, IUserPage } from '../model/model.interface';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserAjaxService {

    sUrl: string = API_URL + "/user";

    constructor(
        private oHttpClient: HttpClient
    ) { }
    getOne(id: number): Observable<IUser> {
        return this.oHttpClient.get<IUser>(this.sUrl + "/" + id);
    }

    getByUsername(username: string): Observable<IUser> {
        return this.oHttpClient.get<IUser>(this.sUrl + "/byUsername/" + username);
    }

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IUserPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        return this.oHttpClient.get<IUserPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection);
    }

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.oHttpClient.delete<number>(this.sUrl + "/" + id);
        } else {
            return new Observable<number>();
        }
    }

    newOne(oUser: IUser): Observable<IUser> {
        return this.oHttpClient.post<IUser>(this.sUrl, oUser);
    }

    newForUsers(oUser: IUser): Observable<IUser> {
        return this.oHttpClient.post<IUser>(this.sUrl + "/new", oUser);
    }

    updateOne(oUser: IUser): Observable<IUser> {
        return this.oHttpClient.put<IUser>(this.sUrl, oUser);
    }

    generateRandom(amount: number): Observable<number> {
        return this.oHttpClient.post<number>(this.sUrl + "/populate/" + amount, null);
    }


    empty(): Observable<number> {
        return this.oHttpClient.delete<number>(this.sUrl + "/empty");
    }


    getUsuarioIdByUsername(username: string): Observable<number | null> {
        return this.oHttpClient.get<IUser[]>(this.sUrl + '/byUsername/' + username).pipe(
            map((usuarios: IUser[]) => {
                if (usuarios.length > 0) {
                    return usuarios[0].id;
                } else {
                    return null;
                }
            }));

    }

    existsByUsername(username: string): Observable<boolean> {
        return this.oHttpClient.get<boolean>(this.sUrl+'/existsByUsername/'+username);
    }

    existsByEmail(email: string): Observable<boolean> {
        return this.oHttpClient.get<boolean>(`${this.sUrl}/existsByEmail/${email}`);
    }
}
