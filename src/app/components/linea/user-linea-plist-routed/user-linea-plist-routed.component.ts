import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEmtService } from '../../../services/api-emt.service';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { DialogService } from 'primeng/dynamicdialog';
import { UserLineaImgUnroutedComponent } from '../user-linea-img-unrouted/user-linea-img-unrouted.component';
import { UserLineaImgErrorUnroutedComponent } from '../user-linea-img-error-unrouted/user-linea-img-error-unrouted.component';
@Component({
  selector: 'app-user-linea-plist-routed',
  templateUrl: './user-linea-plist-routed.component.html',
  standalone: true,
  styleUrls: ['./user-linea-plist-routed.component.scss'],
  imports: [
  CommonModule,
    FormsModule,
    PaginatorModule

  ]
})
export class UserLineaPlistRoutedComponent implements OnInit {
  lineas: string[] = [];
  searchTerm: string = '';
  filterLineas: string[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private ApiEmtService: ApiEmtService,
              private oDialogService: DialogService) { }



  ngOnInit() {
this.ApiEmtService.getAllLineas().subscribe(result => {
  this.filterLineas = result;
  this.lineas = result;
  console.log(result);

  });


}

search() {
  if (this.searchTerm) {
    this.lineas = this.filterLineas.filter(linea =>
      linea.toLowerCase().includes(this.searchTerm.toLowerCase())
    ).sort((a, b) => {
      // Convierte a números y compara de menor a mayor
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return numA - numB;
    });
  } else {
    // Si no hay término de búsqueda, simplemente ordena de menor a mayor
    this.lineas = this.filterLineas.slice().sort((a, b) => parseFloat(a) - parseFloat(b));
  }
}
getCurrentPageItems(): string[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = Math.min(startIndex + this.itemsPerPage, this.lineas.length);
  return this.lineas.slice(startIndex, endIndex);
}

onPageChange(event: any) {
  this.currentPage = event.page + 1;
}doView(linea: string) {
  const imageUrl = `https://www.lovevalencia.com/wp-content/uploads/2012/06/Esquema-Paradas-L%C3%ADnea-${linea}-EMT-Valencia.gif`;
  const width = window.innerWidth < 768 ? '80%' : '40%';

  // Verificar si la imagen existe
  this.imageExists(imageUrl).then(exists => {
    if (exists) {
      // Si la imagen existe, abrir el diálogo con la imagen
      this.oDialogService.open(UserLineaImgUnroutedComponent, {
        data: { imageUrl },
        header: 'Imagen de la línea ' + linea,
        width: width,
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });
    } else {
      // Si la imagen no existe, abrir el diálogo de error
      this.oDialogService.open(UserLineaImgErrorUnroutedComponent, {
        header: 'Error: No existe ruta para esta línea',
        width: '40%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });
    }
  });
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