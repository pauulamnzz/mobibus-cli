import { Component, OnInit } from '@angular/core';
import { UserUserDetailUnroutedComponent } from '../../user/user-user-detail-unrouted/user-user-detail-unrouted.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { IUser, SessionEvent } from '../../../model/model.interface';
import { MenuItem } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-menu-unrouted',
  standalone: true,
  templateUrl: './menu-unrouted.component.html',
  styleUrls: ['./menu-unrouted.component.css'],
  imports:[MenubarModule,
    ButtonModule,
    InputTextModule,
    
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
    private oRouter: Router
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

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-fw pi-home',
        command: () => this.oRouter.navigateByUrl('/home') 
      },
      {
        label: 'Líneas',
        icon: 'pi pi-sort-numeric-down-alt',


      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Añadir usuario',
            icon: 'pi pi-fw pi-user-plus',
            command: () => this.oRouter.navigateByUrl('/admin/user/new') 

          },
          {
            label: 'Lista de usuarios',
            icon: 'pi pi-align-center',
            command: () => this.oRouter.navigateByUrl('/admin/user/plist') 
          },
          
        ]
      },
      {
        label: 'Paradas',
        icon: 'pi pi-map-marker',
        items:[
          {
            label: 'Añadir parada',
            icon: 'pi pi-heart',
          },
          {
            label: 'Lista de paradas',
            icon: 'pi pi-align-center',
            command: () => this.oRouter.navigateByUrl('/admin/user/plist') 
          },
       
        ]
     
      },
      {
        label: 'Más',
        icon: 'pi pi-info-circle'
      }
    ];
    this.oSessionService.on().subscribe({
      next: (data: SessionEvent) => {
        if (data.type == 'login') {
          this.strUserName = this.oSessionService.getUsername();
          this.oUserAjaxService.getByUsername(this.oSessionService.getUsername()).subscribe({
            next: (oUser: IUser) => {
              this.oSessionUser = oUser;
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
            }
          });
        }
        if (data.type == 'logout') {
          this.strUserName = "";
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
