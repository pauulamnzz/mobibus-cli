import { Routes } from '@angular/router';
import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';
import { LoginRoutedComponent } from './components/shared/login-routed/login-routed.component';
import { LogoutRoutedComponent } from './components/shared/logout-routed/logout-routed.component';
import { AdminUserPlistRoutedComponent } from './components/user/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminUserNewRoutedComponent } from './components/user/admin-user-new-routed/admin-user-new-routed.component';
import { AdminUserEditRoutedComponent } from './components/user/admin-user-edit-routed/admin-user-edit-routed.component';
import { AdminUserViewRoutedComponent } from './components/user/admin-user-view-routed/admin-user-view-routed.component';
import { AdminParadaFavViewRoutedComponent } from './components/parada_fav/admin-paradaFav-view-routed/admin-paradaFav-view-routed.component';
import { AdminParadaFavPlistRoutedComponent } from './components/parada_fav/admin-paradaFav-plist-routed/admin-paradaFav-plist-routed.component';
import { AdminParadaFavNewRoutedComponent } from './components/parada_fav/admin-paradaFav-new-routed/admin-paradaFav-new-routed.component';

export const routes: Routes = [
    { path: '', component: HomeRoutedComponent },
    { path: 'home', component: HomeRoutedComponent },
    { path: 'login', component: LoginRoutedComponent },
    { path: 'logout', component: LogoutRoutedComponent },
  
    { path: 'admin/user/plist', component: AdminUserPlistRoutedComponent },    
    { path: 'admin/user/new', component: AdminUserNewRoutedComponent },
    { path: 'admin/user/edit/:id', component: AdminUserEditRoutedComponent },
    { path: 'admin/user/view/:id', component: AdminUserViewRoutedComponent },    




    { path: 'admin/paradaFav/view/:id', component: AdminParadaFavViewRoutedComponent },    
    { path: 'admin/paradaFav/plist', component: AdminParadaFavPlistRoutedComponent },    
    { path: 'admin/paradaFav/new', component: AdminParadaFavNewRoutedComponent },


];
