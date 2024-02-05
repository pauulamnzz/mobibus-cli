import { ParadaFavAjaxService } from './../../../services/parada.fav.ajax.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { IParadaFav, IUser, SessionEvent } from '../../../model/model.interface';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-parada-plist-routed',
  templateUrl: './user-parada-plist-routed.component.html',
  styleUrls: ['./user-parada-plist-routed.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]

})
export class UserParadaPlistRoutedComponent implements OnInit {
  paradasAll: string[] = [];
  searchTermAll: string = '';
  filterParadasAll: string[] = [];


  searchTermFavs: string = '';
  filterParadasFavs: IParadaFav[] = []; 
  paradasFavs: IParadaFav[] = [];
  
  
  @Input() id_user: number = 0; //filter by user
  oUser: IUser | null = null; // data of user if id_user is set for filter
  status: HttpErrorResponse | null = null;
  sessionActive: boolean = false;
  constructor(
    private ApiEmtService: ApiEmtService,
    private oUserAjaxService: UserAjaxService,
    private oSessionAjaxService: SessionAjaxService,
    private oParadaFavAjaxService: ParadaFavAjaxService
  ) { }

  ngOnInit() {
    // Obtener todas las paradas al iniciar el componente
    this.ApiEmtService.getAllParadas().subscribe(result => {
      this.paradasAll = result;
      this.filterParadasAll = result;
      console.log(result);
    });
  
    // Obtener paradas favoritas del usuario en sesión
    if (this.oSessionAjaxService.isSessionActive()) {
      this.sessionActive = true;
      this.oSessionAjaxService.getSessionUser()?.subscribe({
        
        next: (user: IUser) => {
          this.oUser = user;
          console.log(user);
  
          // Actualizar la llamada al servicio con la ruta correcta
          this.oParadaFavAjaxService.getParadasFavByUser(this.oUser.id).subscribe({
            next: (paradasFavs: IParadaFav[]) => {
              this.paradasFavs = paradasFavs;
              this.filterParadasFavs=paradasFavs;
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
  searchAllParadas() {
    if (this.searchTermAll) {
      this.paradasAll = this.filterParadasAll.filter(parada =>
        parada.toLowerCase().includes(this.searchTermAll.toLowerCase())
      ).sort((a, b) => {
        // Convierte a números y compara de menor a mayor
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        return numA - numB;
      });
    } else {
      // Si no hay término de búsqueda, simplemente ordena de menor a mayor
      this.paradasAll = this.filterParadasAll.slice().sort((a, b) => parseFloat(a) - parseFloat(b));
    }
  }
  
  //Filtro
  searchParadasFavs() {
    if (this.searchTermFavs) {
      this.paradasFavs = this.paradasFavs.filter(parada =>
        parada && parada.alias && parada.alias.toLowerCase().includes(this.searchTermFavs.toLowerCase())
      ).sort((a, b) => {
        const numA = parseFloat(a.id_parada.toString());
        const numB = parseFloat(b.id_parada.toString());
        return numA - numB;
      });
    } else {
      this.paradasFavs = this.filterParadasFavs.slice().sort((a, b) => {
        const numA = parseFloat(a.id_parada.toString());
        const numB = parseFloat(b.id_parada.toString());
        return numA - numB;
      });
    }
  }

  redirigirAParadaFav(paradaId: number) {
    const enlace = `http://www.emtvalencia.es/QR.php?sec=est&p=${paradaId}`;
    window.location.href = enlace;
  } 
  redirigirAParada(paradaId: string) {
    const enlace = `http://www.emtvalencia.es/QR.php?sec=est&p=${paradaId}`;
    window.location.href = enlace;
  } 
}
