import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginatorState } from 'primeng/paginator';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiEmtService } from '../../../services/api-emt.service';
import { IResultApi } from '../../../model/model.interface';

@Component({
  selector: 'app-admin-parada-selection-unrouted',
  templateUrl: './admin-parada-selection-unrouted.component.html',
  styleUrls: ['./admin-parada-selection-unrouted.component.scss']
})
export class AdminParadaSelectionUnroutedComponent implements OnInit {

  status: HttpErrorResponse | null = null;
  paradas: IResultApi[] = [];

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


  onSelectParada(id_parada: number) {
    this.oDynamicDialogRef.close(id_parada);
  }
}
