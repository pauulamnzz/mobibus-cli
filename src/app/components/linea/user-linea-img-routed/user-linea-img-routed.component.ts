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
    private oApiEmtService: ApiEmtService,
    private oActivatedRoute: ActivatedRoute,
    private oPdfService: PdfService

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


  // onPrint() {
  //   const doc = new jsPDF();
  //   // Corrige la concatenación de la URL y asegúrate de que 'this.linea' esté definido
  //   const imgData = `https://www.lovevalencia.com/wp-content/uploads/2012/06/Esquema-Paradas-L%C3%ADnea-${this.linea}-EMT-Valencia.gif`;
  //   console.log(imgData);
    
  //   // Asegúrate de que 'this.linea' esté definido antes de usarlo
  //   if (typeof this.linea === 'undefined') {
  //     console.error('La variable "linea" no está definida.');
  //     return;
  //   }
    
  //   // Agrega la imagen al documento PDF
  //   doc.addImage(imgData, 'JPEG', 10, 10, 180, 120);
  //   doc.save('ruta_linea_' + this.linea + '.pdf');
  // }
  
  // async onPrint() {
  //   const doc = new jsPDF();
  //   const linea = 'tu_linea'; // Asegúrate de definir esta variable antes de usarla
  //   const imageUrl = `https://www.lovevalencia.com/wp-content/uploads/2012/06/Esquema-Paradas-L%C3%ADnea-${linea}-EMT-Valencia.gif`;
  
  //   try {
  //     const response = await fetch(imageUrl);
  //     if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
  //     const blob = await response.blob();
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       if (reader.result) { // Verifica que reader.result no sea null
  //         const base64data = reader.result as string; // Asegura que sea tratado como string
  //         doc.addImage(base64data, 'JPEG', 10, 10, 180, 120);
  //         doc.save('ruta_linea_' + linea + '.pdf');
  //       } else {
  //         console.error("Error al leer la imagen como base64");
  //       }
  //     };
  //     reader.readAsDataURL(blob);
  //   } catch (error) {
  //     console.error("Error al cargar la imagen:", error);
  //   }
  // }
  // onPrint() {
  //   const doc = new jsPDF();
  //   const imgData = `https://www.lovevalencia.com/wp-content/uploads/2012/06/Esquema-Paradas-L%C3%ADnea-${this.linea}-EMT-Valencia.gif`;
  //   console.log(imgData);
  //   doc.addImage(imgData, 'JPEG', 10, 10, 180, 120);
  //   doc.save(`ruta_linea_${this.linea}.pdf`);
  // }
  
  // onPrint(){
  //   this.oPdfService.printUserPhoto('url_de_la_imagen.jpg');

  // }


  // convertirImagenAPDF(urlImagen: string, nombreArchivo: string): void {
  //   // Cargar la imagen desde la URL
  //   const img = new Image();
  //   img.crossOrigin = 'Anonymous'; // Para evitar problemas de seguridad al descargar la imagen
  //   img.src = urlImagen;
  
  //   img.onload = function() {
  //     // Crear un nuevo documento PDF
  //     const pdf = new jsPDF();
  
  //     // Dimensiones de la imagen en el PDF
  //     const imgWidth = pdf.internal.pageSize.getWidth();
  //     const imgHeight = img.height * imgWidth / img.width;
  
  //     // Convertir la imagen a Base64
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');
  
  //     // Comprobar si el contexto de renderizado está disponible
  //     if (ctx) {
  //       canvas.width = imgWidth;
  //       canvas.height = imgHeight;
  //       ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
  //       const imgData = canvas.toDataURL('image/jpeg');
  
  //       // Agregar la imagen al PDF
  //       pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  
  //       // Guardar el documento PDF
  //       pdf.save(nombreArchivo);
  //     } else {
  //       console.error('Error: No se pudo obtener el contexto de renderizado del lienzo.');
  //     }
  //   };
  // }

// onPrint()  {
//   fetch('https://www.lovevalencia.com/wp-content/uploads/2012/06/Esquema-Paradas-L%C3%ADnea-' + this.linea + '-EMT-Valencia.gif')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('La solicitud no fue exitosa');
//     }
//     return response.blob();
//   })
//   .then(blob => {
//     // Aquí maneja la respuesta de la solicitud
//     // Por ejemplo, puedes convertir el blob en una URL de objeto o mostrar la imagen en tu aplicación.
//   })
//   .catch(error => {
//     console.error('Ocurrió un error durante la solicitud:', error);
//   });

// }


}
