import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiEmtService } from '../../../services/api-emt.service';
import { IResultApi } from '../../../model/model.interface';

@Component({
  selector: 'app-admin-parada-selection-unrouted',
  templateUrl: './admin-parada-selection-unrouted.component.html',
  styleUrls: ['./admin-parada-selection-unrouted.component.scss'],
  standalone: true,
  imports: [
    PaginatorModule
  ]
})
export class AdminParadaSelectionUnroutedComponent implements OnInit {

  status: HttpErrorResponse | null = null;
  paradas: IResultApi[] = [];

  pageSize = 10; // Tamaño de la página por defecto
  currentPage = 0;

  constructor(

    private ApiEmtService: ApiEmtService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {

    this.ApiEmtService.getAllParadas().subscribe(result => {
      this.paradas = result;
      console.log(result);
    });

  }


  onSelectParada(oResultApi: IResultApi) {
    this.oDynamicDialogRef.close(oResultApi);
  }
  // Métodos para cambiar de página
onPageChange(event: any) {
  this.currentPage = event.page;
}
getCurrentPageItems(): IResultApi[] {
  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return this.paradas.slice(startIndex, endIndex);
}

}
