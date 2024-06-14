import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IParadaFav, IProxLlegada, IUser } from '../../../model/model.interface';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { UserParadaFormUnroutedComponent } from '../user-parada-form-unrouted/user-parada-form-unrouted.component';
import { ParadaComunicationService } from '../../../services/parada.comunication.service';
import { Router, RouterModule } from '@angular/router';
import { UserLineaImgUnroutedComponent } from '../../linea/user-linea-img-unrouted/user-linea-img-unrouted.component';
import { UserLineaImgErrorUnroutedComponent } from '../../linea/user-linea-img-error-unrouted/user-linea-img-error-unrouted.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-parada-detail-unrouted',
  templateUrl: './user-parada-detail-unrouted.component.html',
  styleUrls: ['./user-parada-detail-unrouted.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
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
    private comunicationService: ParadaComunicationService,
    private oRouter: Router,
    private location: Location


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


  goBack() {
    this.location.back();
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
                  } else {
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
    const width = window.innerWidth < 768 ? '80%' : '40%';
    const isMobile = window.innerWidth < 768;
    if(!isMobile){
  
    // Assuming oDialogService.open returns a ref
    this.ref = this.oDialogService.open(UserParadaFormUnroutedComponent, {
      width: '25%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      data: data,
    });
  }else{
      
    // Assuming oDialogService.open returns a ref
    this.ref = this.oDialogService.open(UserParadaFormUnroutedComponent, {
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      data: data,
    });
  }
  
    this.ref.onClose.subscribe((formResult) => {
      if (formResult && formResult.success) {
        // Update the favorite status and trigger UI update
        this.isFavoriteParada = true;
        this.comunicationService.triggerUpdateParadasFavoritas();
      }
    });
  }
  
  removeFav(): void {
    if (this.oUser && this.id) {
      const paradaFavId = this.paradasFavs.find(paradaFav => paradaFav.id_parada === this.id)?.id;
      if (paradaFavId) {
        this.oParadaFavAjaxService.removeOne(paradaFavId).subscribe({
          next: () => {
            this.paradasFavs = this.paradasFavs.filter(paradaFav => paradaFav.id !== paradaFavId);
            this.isFavoriteParada = false; // Update favorite status
            console.log("Parada eliminada de favoritos");
          },
          error: (error: any) => {
            console.error("Error en eliminar la parada de favoritos:", error);
          }
        });
      } else {
        console.error("No se encontró el ID de la parada favorita para eliminar.");
      }
    } else {
      console.error("No se puede eliminar la parada de favoritos. Usuario o ID de parada no válido.");
    }
  }
  

  getNombreParada(): string {
    if (this.isFavoriteParada) {
      const paradaFav = this.paradasFavs.find(paradaFav => paradaFav.id_parada === this.id);
      return paradaFav?.alias || this.oProxLlegada[0]?.nomParada;
    }
    return this.oProxLlegada[0]?.nomParada;
  }
  doView(linea: string) {
    const imageUrl = "../../../../assets/rutas/Esquema-Paradas-Línea-" + linea + "-EMT-Valencia.gif";
     const width = window.innerWidth < 768 ? '80%' : '40%';
      const isMobile = window.innerWidth < 768;
      if(!isMobile){
        // Para PC: Verificar si la imagen existe 
      this.imageExists(imageUrl).then(exists => {
        if (exists) {
          // Si la imagen existe, abrir el diálogo con la imagen
          this.oDialogService.open(UserLineaImgUnroutedComponent, {
            data: { imageUrl, linea},
            header: 'Ruta de línia ' + linea,
            
            width: width,
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false
          });
        } else {
          // Si la imagen no existe, abrir el diálogo de error
          this.oDialogService.open(UserLineaImgErrorUnroutedComponent, {
            header: 'Error: No existe ruta para esta línea',
            width: '40%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false
          });
        }
      });
    }else{
       // Para movil: Verificar si la imagen existe 
      this.imageExists(imageUrl).then(exists => {
        if (exists) {
          this.oRouter.navigate(['user/linea/img/'+linea]);
        }else{
          this.oRouter.navigate(['user/linea/imgError/'+linea]);
        }
      });
     }
    }

    imageExists(url: string): Promise<boolean> {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    }

    
}
