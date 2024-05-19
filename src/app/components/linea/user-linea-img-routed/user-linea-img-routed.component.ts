import { Component, Input, OnInit } from '@angular/core';
import {UserLineaImgUnroutedComponent}  from '../user-linea-img-unrouted/user-linea-img-unrouted.component';
import { ApiEmtService } from '../../../services/api-emt.service';
import { ActivatedRoute } from '@angular/router';
import { UserLineaImgErrorUnroutedComponent } from '../user-linea-img-error-unrouted/user-linea-img-error-unrouted.component';
import jsPDF from 'jspdf';
import { PdfService } from '../../../services/pdf.service';
@Component({
  selector: 'app-user-linea-img-routed',
  templateUrl: './user-linea-img-routed.component.html',
  styleUrls: ['./user-linea-img-routed.component.css'],
  standalone: true,
  imports: [
    UserLineaImgUnroutedComponent,
    UserLineaImgErrorUnroutedComponent
  ]
})
export class UserLineaImgRoutedComponent implements OnInit {
  linea: number = 1;
  
  
  constructor(

    private oActivatedRoute: ActivatedRoute,


  ) {
    this.linea = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }
  ngOnInit() {

  }
  onPrint() {
    const doc = new jsPDF();
    const imgData = "../../../../assets/rutas/Esquema-Paradas-Línea-" + this.linea + "-EMT-Valencia.gif";
    console.log(imgData);
    doc.addImage(imgData, 'JPEG', 10, 10, 150, 250);
    doc.save('ruta_linea_' + this.linea + '.pdf');
  }


}
