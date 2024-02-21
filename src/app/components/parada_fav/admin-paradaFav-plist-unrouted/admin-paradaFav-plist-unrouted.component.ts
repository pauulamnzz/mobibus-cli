import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IParadaFav, IParadaFavPage, IUser } from '../../../model/model.interface';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AdminParadaFavDetailUnroutedComponent } from '../admin-paradaFav-detail-unrouted/admin-paradaFav-detail-unrouted.component';

@Component({
  selector: 'app-admin-paradaFav-plist-unrouted',
  templateUrl: './admin-paradaFav-plist-unrouted.component.html',
  styleUrls: ['./admin-paradaFav-plist-unrouted.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    PaginatorModule,
    ConfirmDialogModule,
    AdminParadaFavDetailUnroutedComponent
  ]
})
export class AdminParadaFavPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_user: number = 0; //filter by user

  oPage: IParadaFavPage | undefined;
  oUser: IUser | null = null; // data of user if id_user is set for filter
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oParadaFavToRemove: IParadaFav | null = null;
  ref: DynamicDialogRef | undefined;

  constructor(
    private oUserAjaxService: UserAjaxService,
    private oParadaFavAjaxService: ParadaFavAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService,
    private oMessageService: MessageService,

  ) { }

  ngOnInit() {
    this.getPage();
    if (this.id_user > 0) {
      console.log("filter by user: " + this.id_user);
      this.getUser();
    }
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }
  getPage(): void {
    this.oParadaFavAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user).subscribe({
      next: (data: IParadaFavPage) => {
        this.oPage = data;
        console.log("filterrr by user: " + this.id_user);

        this.oPaginatorState.pageCount = data.totalPages;
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
      header: 'Detalls de la parada favorita',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
    });
  }


  doRemove(u: IParadaFav) {
    this.oParadaFavToRemove = u;
    this.oConfirmationService.confirm({
      message: '¿Esteu segur que voleu eliminar la parada favorita amb identificador: '+this.oParadaFavToRemove.id+ '?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmació d\'eliminació',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'La parada favorita s\'ha eliminat correctament', life: 2000 });       
        this.oParadaFavAjaxService.removeOne(this.oParadaFavToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary: 'Error', detail: "La parada favorita no s'ha eliminat", life: 2000 });      
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMessageService.add({ severity: 'info', summary: "Operació cancel·lada", detail: "La parada favorita no s'ha eliminat", life: 2000 });       
      }
    });
  }

  getUser(): void {
    this.oUserAjaxService.getOne(this.id_user).subscribe({
      next: (data: IUser) => {
        this.oUser = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

}
