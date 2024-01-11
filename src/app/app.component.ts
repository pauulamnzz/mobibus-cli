import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterUnroutedComponent } from './components/shared/footer-unrouted/footer-unrouted.component';
import { MenuUnroutedComponent } from './components/shared/menu-unrouted/menu-unrouted.component';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
     CommonModule,
     RouterOutlet,
     FooterUnroutedComponent,
     MenuUnroutedComponent,
     ToastModule,
     ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mobibus-cli';
}
