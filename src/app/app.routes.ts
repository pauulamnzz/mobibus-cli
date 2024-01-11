import { Routes } from '@angular/router';
import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';
import { LoginRoutedComponent } from './components/shared/login-routed/login-routed.component';
import { LogoutRoutedComponent } from './components/shared/logout-routed/logout-routed.component';

export const routes: Routes = [
    { path: '', component: HomeRoutedComponent },
    { path: 'home', component: HomeRoutedComponent },
    { path: 'login', component: LoginRoutedComponent },
    { path: 'logout', component: LogoutRoutedComponent },
  
];
