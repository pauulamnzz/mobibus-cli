import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterModule } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AdminParadaFavDetailUnroutedComponent } from '../admin-paradaFav-detail-unrouted/admin-paradaFav-detail-unrouted.component';
import { AdminParadaFavPlistUnroutedComponent } from '../admin-paradaFav-plist-unrouted/admin-paradaFav-plist-unrouted.component';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { ActivatedRoute } from '@angular/router';
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
    ConfirmDialogModule,
    AdminParadaFavDetailUnroutedComponent,
    AdminParadaFavPlistUnroutedComponent,
    
  ]
})
export class AdminParadaFavPlistRoutedComponent implements OnInit {
  
  forceReload: Subject<boolean> = new Subject<boolean>();
  bLoading: boolean = false;
  id_user: number;
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oParadaFavAjaxService: ParadaFavAjaxService,
    private oConfirmationService: ConfirmationService,
    private oMessageService: MessageService,
  ) { 
    this.id_user = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") ?? "0");
  }

  ngOnInit() {
    console.log("filterr by user: " + this.id_user);
  }
  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.oParadaFavAjaxService.generateRandom(amount).subscribe({
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
        });
      },
      reject: () => {
        this.oMessageService.add({ severity: 'info', summary: 'Empty Cancelled', detail: 'Empty operation cancelled.' });
      }
    });
  }
}
