import { ParadaFavAjaxService } from './../../../services/parada.fav.ajax.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { IParadaFav, IResultApi, IUser, SessionEvent } from '../../../model/model.interface';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-user-parada-plist-routed',
  templateUrl: './user-parada-plist-routed.component.html',
  styleUrls: ['./user-parada-plist-routed.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaginatorModule
  ]

})
export class UserParadaPlistRoutedComponent implements OnInit {
  paradasAll: IResultApi[] = [];
  searchTermAll: string = '';
  filterParadasAll: IResultApi[] = [];


  searchTermFavs: string = '';
  filterParadasFavs: IParadaFav[] = []; 
  paradasFavs: IParadaFav[] = [];

  pageSize = 10; // Tamaño de la página por defecto
  currentPageAll = 0;
  currentPageFavs = 0;
  
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

    this.ApiEmtService.
    getAllParadas().subscribe({
      next: (result: IResultApi[]) => {
        this.paradasAll = result;
        this.filterParadasAll = result;
        console.log(result);
      },
      error: (error: any) => {
        console.error(error);
       
      }
    });
  
    // Obtener paradas favoritas del usuario en sesión
    if (this.oSessionAjaxService.isSessionActive()) {
      this.sessionActive = true;
      this.oSessionAjaxService.getSessionUser()?.subscribe({
        
        next: (user: IUser) => {
          this.oUser = user;
       
  
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
        (parada.id_parada && parada.id_parada.toString().includes(this.searchTermAll.toLowerCase())) ||
        (parada.denominacion && parada.denominacion.toLowerCase().includes(this.searchTermAll.toLowerCase()))
      ).sort((a, b) => {
        // Convierte a números y compara de menor a mayor
        const numA = parseFloat(a.id_parada.toString());
        const numB = parseFloat(b.id_parada.toString());
        return numA - numB;
      });
    } else {
      // Si no hay término de búsqueda, simplemente ordena de menor a mayor
      this.paradasAll = this.filterParadasAll.slice().sort((a, b) => {
        const numA = parseFloat(a.id_parada.toString());
        const numB = parseFloat(b.id_parada.toString());
        return numA - numB;
      });
    }
  }
  
  //Filtro
  searchParadasFavs() {
    if (this.searchTermFavs) {
      this.paradasFavs = this.filterParadasFavs.filter(parada =>
        (parada.alias && parada.alias.toLowerCase().includes(this.searchTermFavs.toLowerCase())) ||
        (parada.id_parada && parada.id_parada.toString().includes(this.searchTermFavs.toLowerCase()))
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

// Métodos para cambiar de página
onPageChangeAll(event: any) {
  this.currentPageAll = event.page;
}

onPageChangeFavs(event: any) {
  this.currentPageFavs = event.page;
}

// Método para obtener las paradas de la página actual
getCurrentPageItemsAll(): IResultApi[] {
  const startIndex = this.currentPageAll * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return this.paradasAll.slice(startIndex, endIndex);
}

getCurrentPageItemsFavs(): IParadaFav[] {
  const startIndex = this.currentPageFavs * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return this.paradasFavs.slice(startIndex, endIndex);
}
}
