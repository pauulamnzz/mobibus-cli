import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserLineaImgRoutedComponent } from '../user-linea-img-routed/user-linea-img-routed.component';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-user-linea-img-unrouted',
  templateUrl: './user-linea-img-unrouted.component.html',
  styleUrls: ['./user-linea-img-unrouted.component.css'],
  standalone: true,
  imports: [
    UserLineaImgRoutedComponent
  ]
})
export class UserLineaImgUnroutedComponent implements OnInit {
  imageUrl: string | undefined;
  @Input() linea: number = 1;

  constructor(
     private config: DynamicDialogConfig
  ) { }
  ngOnInit() {
  this.imageUrl = this.config.data.imageUrl;
  this.linea = this.config.data.linea;
  }

  onPrint() {
    const doc = new jsPDF();
    const img = new Image();
    img.src = this.imageUrl || "";
  
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
      const maxWidth = 150; // Máximo ancho permitido en el PDF
      const maxHeight = 250; // Máximo alto permitido en el PDF
  
      // Mantener la proporción de la imagen
      let width = originalWidth;
      let height = originalHeight;
  
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }
  
      doc.addImage(img, 'JPEG', 10, 10, width, height);
      doc.save('ruta_linea_' + this.linea + '.pdf');
    };
  
    img.onerror = (error) => {
      console.error("Error loading image: ", error);
    };
  }
  
}
