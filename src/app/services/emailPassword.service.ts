import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailValuesDto } from '../model/model.changePasswordDto';
import { ChangePasswordDto } from '../model/model.emailValuesDto';

@Injectable({
  providedIn: 'root'
})
export class EmailPasswordService {

  constructor(
    private oHttpClient: HttpClient
) { 

}


//local
//changePasswordUrl: string = "http://localhost:8083/email/";

//despliegue
changePasswordUrl: string = "/initial/email/";

public sendEmail(oEmailValuesDto: EmailValuesDto): Observable<any>{
    return this.oHttpClient.post<any>(this.changePasswordUrl + 'recover-password', oEmailValuesDto);
}

public changePassword(oEmailValuesDto: ChangePasswordDto): Observable<any>{
    return this.oHttpClient.post<any>(this.changePasswordUrl + 'change-password', oEmailValuesDto);
}


}
