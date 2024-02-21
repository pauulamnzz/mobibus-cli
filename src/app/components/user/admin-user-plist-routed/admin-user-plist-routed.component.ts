import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AdminUserDetailUnroutedComponent } from '../admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { RouterModule } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AdminUserPlistUnroutedComponent } from "../admin-user-plist-unrouted/admin-user-plist-unrouted.component";
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-admin-user-plist-routed',
    standalone: true,
    templateUrl: './admin-user-plist-routed.component.html',
    styleUrls: ['./admin-user-plist-routed.component.scss'],
    imports: [
        MessagesModule,
        ProgressSpinnerModule,
        RouterModule,
        AdminUserPlistUnroutedComponent,
        AdminUserDetailUnroutedComponent
     
    ]
})
export class AdminUserPlistRoutedComponent implements OnInit {
  
  forceReload: Subject<boolean> = new Subject<boolean>();
  bLoading: boolean = false;


  constructor(
    private oUserAjaxService: UserAjaxService,
    private oConfirmationService: ConfirmationService,
    private oMessageService: MessageService,
  ) { }

  ngOnInit() {
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget, 
      message: '¿Estàs segur que vols eliminar tots els usuaris?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmació d\'eliminació',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.oUserAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'Parades favorites buidades amb èxitUsers emptied successfully.' });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'Error en l\'operació de buidatge'});
            this.bLoading = false;
          },
        });
      },
      reject: () => {
        this.oMessageService.add({ severity: 'info', summary: 'Buidatge Cancel·lat', detail: 'Operació de buidatge cancel·lada' });
      }
    });
  }
}
