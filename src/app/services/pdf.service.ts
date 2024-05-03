import { Injectable } from '@angular/core';
import  jsPDF  from "jspdf"; // Método común si jsPDF soporta ES6
import { UserAjaxService } from './user.ajax.service';
import { IUser } from '../model/model.interface';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

constructor(
  private oUserAjaxService: UserAjaxService,
) { }

doPdf = (id_user: number): void => {
  this.oUserAjaxService.getOne(id_user).subscribe({
    next: (oUserToPrint: IUser) => {
      console.log('User to print:', oUserToPrint);
      var doc = new jsPDF();
      doc.setFont('Arial');
      doc.setFontSize(12);
      doc = this.cabecera(doc);
      doc = this.contenido(doc, oUserToPrint);
      doc = this.pie(doc);
      console.log(doc);
      doc.save('profile.pdf');


    }
  })
}


private cabecera(doc: jsPDF) : jsPDF{
  const indigoPastel =  "#7887AB";
  //doc.setFontType('bold');
  doc.setFontSize(20);
  doc.text('ThousandBurgers', 70, 25);
  //
  doc.setDrawColor(indigoPastel);
  doc.line(60, 30, 145, 30);
  //
  doc.text('Client Profile', 80, 40);
  doc.setDrawColor(indigoPastel);
  doc.line(10, 45, 200, 45);
  //doc.setFontType('normal');

  return doc;
}

private contenido(doc: jsPDF, oUser: IUser) : jsPDF {
  const baseX = 10;
  const indigoPastel =  "#7887AB";
  doc.setTextColor(0, 0, 0, 0);
  doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
  parseInt(indigoPastel.substring(3, 5), 16),
  parseInt(indigoPastel.substring(5, 7), 16));
  doc.roundedRect(baseX, 55, 80, 15, 5, 5, 'F');
  doc.setFontSize(14);

  doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
    parseInt(indigoPastel.substring(3, 5), 16),
    parseInt(indigoPastel.substring(5, 7), 16));
  doc.roundedRect(baseX, 75, 80, 15, 5, 5, 'F');
  doc.setFontSize(14);
  doc.text(`ID: ${oUser.id}` ,20,64);
  return doc;
}

private pie(doc: jsPDF): any {
  const indigoPastel = "#7887AB";
  doc.setDrawColor(indigoPastel);
  doc.line(10, 244, 200, 244);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); 
  doc.text(`CIPFP Ausiàs March`, 11,254 );
  doc.text(`Télf: 961205930`, 11,264 );
  doc.text(`Fax: 961205931`, 65, 264);
  doc.text(`C/Ángel Villena, s/n. 46013 Valencia`, 11,274 );
  doc.text( `secretaria@ausiasmarch.net`, 11,284);

  return doc;
}

}
