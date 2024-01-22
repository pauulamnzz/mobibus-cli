import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IParadaFav, IParadaFavPage } from '../../../model/model.interface';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParadaFavAjaxService } from '../../../services/paradaFav.ajax.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AdminParadaFavDetailUnroutedComponent } from '../admin-paradaFav-detail-unrouted/admin-paradaFav-detail-unrouted.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterModule } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-paradaFav-plist-unrouted',
  templateUrl: './admin-paradaFav-plist-unrouted.component.html',
  styleUrls: ['./admin-paradaFav-plist-unrouted.component.css'],
  standalone: true,
  imports:[
    PaginatorModule,
    ConfirmDialogModule,
    RouterModule,
    MessagesModule,
    AdminParadaFavDetailUnroutedComponent,
    CommonModule
    
  ],
})
export class AdminParadaFavPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  oPage: IParadaFavPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oParadaFavToRemove: IParadaFav | null = null;
  ref: DynamicDialogRef | undefined;
  paradas_favs: any[] = [];

  constructor(
    private oParadaFavAjaxService: ParadaFavAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService,
    private oMessageService: MessageService,
  ) { }

  ngOnInit() {
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }
  getPage(): void {
    this.oParadaFavAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IParadaFavPage) => {
        this.oPage = data;
        this.paradas_favs = data.content;
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
  doView(u: IParadaFav) {
    this.ref = this.oDialogService.open(AdminParadaFavDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: 'Vista de las Paradas favoritas',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      styleClass:'my-custom-dialog'
    });
  }
  doRemove(pf: IParadaFav) {
    this.oParadaFavToRemove = pf;
    this.oConfirmationService.confirm({
      accept: () => {
        this.oMessageService.add({ severity: 'success', summary: 'Success', detail: 'The jugador has been removed.', life: 2000 });       
        this.oParadaFavAjaxService.removeOne(this.oParadaFavToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary: 'Danger', detail: "The jugador hasn't been removed.", life: 2000 });          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMessageService.add({ severity: 'error', summary: "The jugador hasn't been removed.", detail: "The jugador hasn't been removed.", life: 2000 });       }
    });
  }
}
