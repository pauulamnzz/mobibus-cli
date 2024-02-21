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
  styleUrls: ['./admin-paradaFav-plist-routed.component.scss'],
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

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: '¿Estàs segur que vols eliminar totes les parades favorites?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmació d\'eliminació',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.oParadaFavAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMessageService.add({ severity: 'success', summary: 'Buidat amb èxit', detail: 'Usuaris buidats amb èxit' }); this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'Error en l\'operació de buidatge' }); this.bLoading = false;
          },
        });
      },
      reject: () => {
        this.oMessageService.add({ severity: 'info', summary: 'Buidatge Cancel·lat', detail: 'Operació de buidatge cancel·lada' });
      }
    });
  }
}
