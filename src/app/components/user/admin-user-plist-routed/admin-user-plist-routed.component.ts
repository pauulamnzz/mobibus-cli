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
    styleUrls: ['./admin-user-plist-routed.component.css'],
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

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.oUserAjaxService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {
        this.oMessageService.add({ severity: 'info', summary: 'Success', detail: 'Now there are ' + oResponse + ' users', life: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMessageService.add({ severity: 'error', summary: 'Error generating user', detail: oError.message, life: 2000 });        this.bLoading = false;
        this.bLoading = false;
      },
    })
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget, 
      message: 'Are you sure that you want to remove all the users?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.oUserAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMessageService.add({ severity: 'success', summary: 'Empty Successful', detail: 'Users emptied successfully.' });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'Error in empty operation.'});
            this.bLoading = false;
          },
        });
      },
      reject: () => {
        this.oMessageService.add({ severity: 'info', summary: 'Empty Cancelled', detail: 'Empty operation cancelled.' });
      }
    });
  }
}
