import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IParadaEmt, IParadaFav, IUser } from '../../../model/model.interface';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-parada-detail-unrouted',
  templateUrl: './user-parada-detail-unrouted.component.html',
  styleUrls: ['./user-parada-detail-unrouted.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class UserParadaDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;

  status: HttpErrorResponse | null = null;
  oParadaEmt: IParadaEmt[] = [];
  buses: IParadaEmt[] = [];

  paradasFavs: IParadaFav[] = [];
  oUser: IUser | null = null; // data of user if id_user is set for filter

  isFavoriteParada: boolean = false; // Variable para indicar si la parada es favorita
  constructor(
    private oApiEmtAjaxService: ApiEmtService,
    private oSessionAjaxService: SessionAjaxService,
    private oParadaFavAjaxService: ParadaFavAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
  }

  ngOnInit() {
    this.getOne();
  }
  getOne(): void {
    this.oApiEmtAjaxService.getInfoLlegadas(this.id).subscribe({
      next: (data: IParadaEmt[]) => {
        this.oParadaEmt = data;
        console.log(this.oParadaEmt);


        if (this.oSessionAjaxService.isSessionActive()) {
          this.oSessionAjaxService.getSessionUser()?.subscribe({
            next: (user: IUser) => {
              this.oUser = user;
              this.oParadaFavAjaxService.getParadasFavByUser(this.oUser.id).subscribe({
                next: (paradasFavs: IParadaFav[]) => {
                  this.paradasFavs = paradasFavs;
                  console.log(paradasFavs);
                  if (this.paradasFavs.some(paradaFav => paradaFav.id_parada === this.id)) {
                    this.isFavoriteParada = true;
                    console.log("La parada es favorita");
                  }else{
                    console.log("La parada no es favorita");
                    this.isFavoriteParada = false;

                  }
                },
                error: (error: any) => {
                  console.error("Error obteniendo las paradas favoritas del usuario:", error);
                }
              });
            },
            error: (error: any) => {
              console.error("Error obteniendo el usuario de la sesión:", error);
            }
          });
        } else {
          console.log("No hay sesión activa");
        }
      },

      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
}
