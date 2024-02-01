import { ParadaFavAjaxService } from './../../../services/parada.fav.ajax.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { IParadaFav, IUser, SessionEvent } from '../../../model/model.interface';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-parada-plist-routed',
  templateUrl: './user-parada-plist-routed.component.html',
  styleUrls: ['./user-parada-plist-routed.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]

})
export class UserParadaPlistRoutedComponent implements OnInit {
  paradas: string[] = [];
  searchTerm: string = '';
  filterParadas: string[] = [];

  paradasFavs: IParadaFav[] | undefined;

  @Input() id_user: number = 0; //filter by user
  oUser: IUser | null = null; // data of user if id_user is set for filter
  status: HttpErrorResponse | null = null;

  constructor(
    private ApiEmtService: ApiEmtService,
    private oUserAjaxService: UserAjaxService,
    private oSessionAjaxService: SessionAjaxService,
    private oParadaFavAjaxService: ParadaFavAjaxService
  ) { }

  ngOnInit() {
    // Obtener todas las paradas al iniciar el componente
    this.ApiEmtService.getAllParadas().subscribe(result => {
      this.paradas = result;
      this.filterParadas = result;
      console.log(result);
    });
  
    // Obtener paradas favoritas del usuario en sesión
    if (this.oSessionAjaxService.isSessionActive()) {
      this.oSessionAjaxService.getSessionUser()?.subscribe({
        next: (user: IUser) => {
          this.oUser = user;
          console.log(user);
  
          // Actualizar la llamada al servicio con la ruta correcta
          this.oParadaFavAjaxService.getParadasFavByUser(this.oUser.id).subscribe({
            next: (paradasFavs: IParadaFav[]) => {
              this.paradasFavs = paradasFavs;
              console.log(paradasFavs);
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
  }


  //Filtro
  search() {
    if (this.searchTerm) {
      this.paradas = this.filterParadas.filter(parada =>
        parada.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.paradas = this.filterParadas;
    }
  }

 
}
