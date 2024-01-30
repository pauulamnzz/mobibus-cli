import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IUser, IUserPage } from '../../../model/model.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AdminUserDetailUnroutedComponent } from '../admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-user-plist-unrouted',
  standalone: true,
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css'],
  imports:[
   RouterModule,
   PaginatorModule,
   ConfirmDialogModule,
   AdminUserDetailUnroutedComponent,
  
    
  ],

})
export class AdminUserPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  
  oPage: IUserPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oUserToRemove: IUser | null = null;
  ref: DynamicDialogRef | undefined;



  constructor(
    private oUserAjaxService: UserAjaxService,
    public oDialogService: DialogService,
    private oCconfirmationService: ConfirmationService,
    private oMessageService: MessageService,

  ) { 
  }

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
    this.oUserAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IUserPage) => {
        this.oPage = data;
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



  doView(u: IUser) {
    this.ref = this.oDialogService.open(AdminUserDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: 'Vista de usuario',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      styleClass:'my-custom-dialog'
    });
  }
  doRemove(u: IUser) {
    this.oUserToRemove = u;
    console.log(this.oUserToRemove);
    this.oCconfirmationService.confirm({
      message: 'Estás seguro de que quieres eliminar a '+this.oUserToRemove.username+ '?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación de eliminación',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.oMessageService.add({ severity: 'success', summary: 'Success', detail: 'The jugador has been removed.', life: 2000 });       
         this.oUserAjaxService.removeOne(this.oUserToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary: 'Danger', detail: "The jugador hasn't been removed.", life: 2000 });      
              }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMessageService.add({ severity: 'error', summary: "The jugador hasn't been removed.", detail: "The jugador hasn't been removed.", life: 2000 });       
         }
      }
    );
  }

}
