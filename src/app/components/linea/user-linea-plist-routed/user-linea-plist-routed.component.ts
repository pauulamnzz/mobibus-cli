import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEmtService } from '../../../services/api-emt.service';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';

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

  constructor(private ApiEmtService: ApiEmtService) { }



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
}

}