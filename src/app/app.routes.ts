import { Routes } from '@angular/router';
import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';
import { LoginRoutedComponent } from './components/shared/login-routed/login-routed.component';
import { LogoutRoutedComponent } from './components/shared/logout-routed/logout-routed.component';
import { AdminUserPlistRoutedComponent } from './components/user/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminUserNewRoutedComponent } from './components/user/admin-user-new-routed/admin-user-new-routed.component';
import { AdminUserEditRoutedComponent } from './components/user/admin-user-edit-routed/admin-user-edit-routed.component';
import { AdminUserViewRoutedComponent } from './components/user/admin-user-view-routed/admin-user-view-routed.component';
import { UserLineaPlistRoutedComponent } from './components/linea/user-linea-plist-routed/user-linea-plist-routed.component';
import { AdminParadaFavPlistRoutedComponent } from './components/parada_fav/admin-paradaFav-plist-routed/admin-paradaFav-plist-routed.component';
import { AdminParadaFavViewRoutedComponent } from './components/parada_fav/admin-paradaFav-view-routed/admin-paradaFav-view-routed.component';
import { AdminParadaFavNewRoutedComponent } from './components/parada_fav/admin-paradaFav-new-routed/admin-paradaFav-new-routed.component';
import { AdminParadaFavEditRoutedComponent } from './components/parada_fav/admin-paradaFav-edit-routed/admin-paradaFav-edit-routed.component';
import { UserParadaPlistRoutedComponent } from './components/parada/user-parada-plist-routed/user-parada-plist-routed.component';
import { UserParadaViewRoutedComponent } from './components/parada/user-parada-view-routed/user-parada-view-routed.component';

export const routes: Routes = [
    { path: '', component: HomeRoutedComponent },
    { path: 'home', component: HomeRoutedComponent },
    { path: 'login', component: LoginRoutedComponent },
    { path: 'logout', component: LogoutRoutedComponent },
  
    { path: 'admin/user/plist', component: AdminUserPlistRoutedComponent }, 
    { path: 'admin/user/view/:id', component: AdminUserViewRoutedComponent },     
    { path: 'admin/user/new', component: AdminUserNewRoutedComponent },
    { path: 'admin/user/edit/:id', component: AdminUserEditRoutedComponent },
  


    { path: 'user/linea/plist', component: UserLineaPlistRoutedComponent },    
    { path: 'user/parada/plist', component: UserParadaPlistRoutedComponent },    


    { path: 'admin/paradaFav/plist', component: AdminParadaFavPlistRoutedComponent },    
    { path: 'admin/paradaFav/view/:id', component: AdminParadaFavViewRoutedComponent },    
    { path: 'admin/paradaFav/new', component: AdminParadaFavNewRoutedComponent },
    { path: 'admin/paradaFav/edit/:id', component: AdminParadaFavEditRoutedComponent },
    { path: 'admin/paradaFav/plist/byuser/:id', component: AdminParadaFavPlistRoutedComponent },


    { path: 'user/parada/view/:id', component: UserParadaViewRoutedComponent },    

    
];
