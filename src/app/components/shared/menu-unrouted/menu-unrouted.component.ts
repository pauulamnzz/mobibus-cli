import { Component, OnInit } from '@angular/core';
import { UserUserDetailUnroutedComponent } from '../../user/user-user-detail-unrouted/user-user-detail-unrouted.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { IUser, SessionEvent } from '../../../model/model.interface';
import { NavigationEnd, Router } from '@angular/router';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { MenubarModule } from 'primeng/menubar';
import { Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-menu-unrouted',
  standalone: true,
  templateUrl: './menu-unrouted.component.html',
  styleUrls: ['./menu-unrouted.component.scss'],
  imports:[
    MenubarModule,
  ],
  
})
export class MenuUnroutedComponent implements OnInit {
  strUserName: string = "";
  oSessionUser: IUser | null = null;
  strUrl: string = "";
  
  /*
  Suscripción al Evento de Cambio de Ruta
  Obtención de Información del Usuario y Actualización de Propiedades
  */
  constructor(
    private oSessionService: SessionAjaxService,
    public oDialogService: DialogService,
    private oUserAjaxService: UserAjaxService,
    private oRouter: Router,
    private renderer: Renderer2, private el: ElementRef
  ) {
    this.oRouter.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.strUrl = ev.url;
      }
    })
    
    this.strUserName = oSessionService.getUsername();
    this.oUserAjaxService.getByUsername(this.oSessionService.getUsername()).subscribe({
      next: (oUser: IUser) => {
        this.oSessionUser = oUser;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
   }



   ngOnInit() {
    // Suscribirse al evento de inicio de sesión y cierre de sesión
    this.oSessionService.on().subscribe({
      next: (data: SessionEvent) => {
        if (data.type === 'login') {
          // Cuando el usuario inicia sesión, actualizar el nombre de usuario
          this.strUserName = this.oSessionService.getUsername();
          
          // Obtener los detalles del usuario y actualizar el estado de usuario
          this.oUserAjaxService.getByUsername(this.oSessionService.getUsername()).subscribe({
            next: (oUser: IUser) => {
              this.oSessionUser = oUser;
              // Actualizar el rol de administrador si es necesario
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
            }
          });
        } else if (data.type === 'logout') {
          // Cuando el usuario cierra sesión, limpiar las propiedades relacionadas con la sesión
          this.strUserName = "";
          this.oSessionUser = null;
        }
      }
    });
  }
  redirectToLogin() {
    this.oRouter.navigateByUrl('/login');
  }
  redirectToLogout() {
    this.oRouter.navigateByUrl('/logout');
  }

     doSessionUserView($event: Event) {
    if (this.oSessionUser) {
      let ref: DynamicDialogRef | undefined;
      ref = this.oDialogService.open(UserUserDetailUnroutedComponent, {
        data: {
          id: this.oSessionUser.id
        },
        header: 'Vista de usuario',
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });
    }
    return false;
  } 

}
