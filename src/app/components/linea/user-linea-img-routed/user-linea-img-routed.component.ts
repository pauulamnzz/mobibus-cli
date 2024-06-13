import { Component, Input, OnInit } from '@angular/core';
import {UserLineaImgUnroutedComponent}  from '../user-linea-img-unrouted/user-linea-img-unrouted.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLineaImgErrorUnroutedComponent } from '../user-linea-img-error-unrouted/user-linea-img-error-unrouted.component';
import jsPDF from 'jspdf';
import { Location } from '@angular/common';

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
  imageUrl = "../../../../assets/rutas/Esquema-Paradas-Línea-" + this.linea + "-EMT-Valencia.gif";

  
  constructor(

    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router,
    private location: Location


  ) {
    //this.linea = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }
  ngOnInit() {
    this.linea = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
    this.imageUrl = "../../../../assets/rutas/Esquema-Paradas-Línea-" + this.linea + "-EMT-Valencia.gif";
    
    this.imageExists(this.imageUrl).then(exists => {
      if (exists) {
        // Si la imagen existe, no redirigir
      } else {
        this.oRouter.navigate(['/user/linea/imgError/', this.linea]);
      }
    });
  }

  goBack() {
    this.location.back();
    }

  onPrint() {
    const doc = new jsPDF();
    const imgData = "../../../../assets/rutas/Esquema-Paradas-Línea-" + this.linea + "-EMT-Valencia.gif";
    console.log(imgData);
    doc.addImage(imgData, 'JPEG', 10, 10, 150, 250);
    doc.save('ruta_linea_' + this.linea + '.pdf');
  }

  imageExists(url: string): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}
