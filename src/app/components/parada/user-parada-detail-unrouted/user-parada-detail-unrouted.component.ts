import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IParadaFav, IProxLlegada, IUser } from '../../../model/model.interface';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { CommonModule } from '@angular/common';
import { UserParadaFormUnroutedComponent } from '../user-parada-form-unrouted/user-parada-form-unrouted.component';
import { ParadaComunicationService } from '../../../services/parada.comunication.service';

@Component({
  selector: 'app-user-parada-detail-unrouted',
  templateUrl: './user-parada-detail-unrouted.component.html',
  styleUrls: ['./user-parada-detail-unrouted.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class UserParadaDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;

  status: HttpErrorResponse | null = null;
  oProxLlegada: IProxLlegada[] = [];

  paradasFavs: IParadaFav[] = [];
  oUser: IUser | null = null; // data of user if id_user is set for filter

  isFavoriteParada: boolean = false; // Variable para indicar si la parada es favorita
  constructor(
    private oApiEmtAjaxService: ApiEmtService,
    private oSessionAjaxService: SessionAjaxService,
    private oParadaFavAjaxService: ParadaFavAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig,
    public oDialogService: DialogService,
    private comunicationService: ParadaComunicationService

  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
  }

  ngOnInit() {
    this.getOne();
    this.comunicationService.updateParadasFavoritas$.subscribe(() => {
      this.getOne();
    });
  }
  getOne(): void {
    this.oApiEmtAjaxService.getInfoLlegadas(this.id).subscribe({
      next: (data: IProxLlegada[]) => {
        this.oProxLlegada = data;
        console.log(this.oProxLlegada);


        if (this.oSessionAjaxService.isSessionActive()) {
          this.oSessionAjaxService.getSessionUser()?.subscribe({
            next: (user: IUser) => {
              this.oUser = user;
              //this.oUser = { id: this.oSessionAjaxService.getSessionUserId() } as unknown as IUser;
              this.oParadaFavAjaxService.getParadasFavByUser(this.oUser.id).subscribe({
                next: (paradasFavs: IParadaFav[]) => {
                  this.paradasFavs = paradasFavs;
                  console.log(paradasFavs);
                  if (this.paradasFavs.some(paradaFav => paradaFav.id_parada === this.id)) {
                    this.isFavoriteParada = true;
                    console.log("La parada es favorita");
                  } else {
                    console.log("La parada no es favorita");
                    this.isFavoriteParada = false;

                  }
                },
                error: (error: any) => {
                  console.error("Error en obtenir les parades favorites de l'usuari:", error);
                }
              });
            },
            error: (error: any) => {
              console.error("Error en obtenir l'usuari de la sessió:", error);
            }
          });
        } else {
          console.log("No hi ha cap sessió activa");
    
        }
      },

      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }


  addFav() {
    const data = {
      usuario: this.oUser,
      id_parada: this.id

    };
    this.ref = this.oDialogService.open(UserParadaFormUnroutedComponent, {

      width: '25%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      data: data,

    });
    this.ref.onClose.subscribe(() => {
      this.comunicationService.triggerUpdateParadasFavoritas();
    });
  }

  removeFav(): void {
    if (this.oUser && this.id) {
      const paradaFavId = this.paradasFavs.find(paradaFav => paradaFav.id_parada === this.id)?.id;
      if (paradaFavId) {
        this.oParadaFavAjaxService.removeOne(paradaFavId).subscribe({
          next: () => {
            this.paradasFavs = this.paradasFavs.filter(paradaFav => paradaFav.id !== paradaFavId);
            this.isFavoriteParada = false;
            console.log("Parada eliminada de favorites");
          },
          error: (error: any) => {
            console.error("Error en eliminar la parada de favorites:", error);
          }
        });
      } else {
        console.error("No s'ha trobat l'ID de la parada favorita per eliminar.");
      }
    } else {
      console.error("No es pot eliminar la parada de favorites. Usuari o ID de parada no vàlid.");
    }
  }
}
