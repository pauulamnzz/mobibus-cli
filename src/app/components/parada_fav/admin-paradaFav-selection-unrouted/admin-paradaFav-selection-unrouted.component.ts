import { Component, Input, OnInit } from '@angular/core';
import { IParadaFav, IParadaFavPage } from '../../../model/model.interface';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { AdminParadaFavDetailUnroutedComponent } from '../admin-paradaFav-detail-unrouted/admin-paradaFav-detail-unrouted.component';

@Component({
  selector: 'app-admin-paradaFav-selection-unrouted',
  templateUrl: './admin-paradaFav-selection-unrouted.component.html',
  styleUrls: ['./admin-paradaFav-selection-unrouted.component.css'],
  standalone: true,
  imports: [
    PaginatorModule,
    ConfirmDialogModule,
    AdminParadaFavDetailUnroutedComponent
  ]
})
export class AdminParadaFavSelectionUnroutedComponent implements OnInit {
  
  @Input() id_user: number = 0; //filter by user

  oPage: IParadaFavPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oParadaFavToRemove: IParadaFav | null = null;

  constructor(
    private oParadaFavAjaxService: ParadaFavAjaxService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.getPage();
  }
  getPage(): void {
    this.oParadaFavAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user).subscribe({
      next: (data: IParadaFavPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        console.log(this.oPaginatorState);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }

  onPageChang(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }

  onSelectParadaFav(oParadaFav: IParadaFav) {
    this.oDynamicDialogRef.close(oParadaFav);
  }
}
