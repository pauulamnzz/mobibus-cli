import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ParadaFavAjaxService } from '../../../services/paradaFav.ajax.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AdminParadaFavDetailUnroutedComponent } from '../admin-paradaFav-detail-unrouted/admin-paradaFav-detail-unrouted.component';
import { AdminUserPlistUnroutedComponent } from '../../user/admin-user-plist-unrouted/admin-user-plist-unrouted.component';
import { AdminParadaFavPlistUnroutedComponent } from "../admin-paradaFav-plist-unrouted/admin-paradaFav-plist-unrouted.component";
@Component({
    selector: 'app-admin-paradaFav-plist-routed',
    templateUrl: './admin-paradaFav-plist-routed.component.html',
    styleUrls: ['./admin-paradaFav-plist-routed.component.css'],
    standalone: true,
    imports: [
        MessagesModule,
        ProgressSpinnerModule,
        RouterModule,
        ConfirmPopupModule,
        AdminUserPlistUnroutedComponent,
        AdminParadaFavPlistUnroutedComponent
    ]
})
export class AdminParadaFavPlistRoutedComponent implements OnInit {
  forceReload: Subject<boolean> = new Subject<boolean>();
  bLoading: boolean = false;

  constructor(
    private oParadaFavAjaxService: ParadaFavAjaxService,
    private oConfirmationService: ConfirmationService,
    private oMessageService: MessageService,
  ) { }

  ngOnInit() {
  }
  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.oParadaFavAjaxService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {
        this.oMessageService.add({ severity: 'info', summary: 'Success', detail: 'Ahora hay ' + oResponse + ' paradas favoritas', life: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMessageService.add({ severity: 'error', summary: 'Error generando la parada favorita', detail: oError.message, life: 2000 });        this.bLoading = false;
        this.bLoading = false;
      },
    })
  }
  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget, 
      message: 'Estás seguro de que deseas eliminar todas las paradas favoritas?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.oParadaFavAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMessageService.add({ severity: 'success', summary: 'Empty Successful', detail: 'Users emptied successfully.' });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'Error in empty operation.'});
            this.bLoading = false;
          },
        })
      },
      reject: () => {
        this.oMessageService.add({ severity: 'info', summary: 'Empty Cancelled', detail: 'Empty operation cancelled.' });
      }
    });
  }
}
