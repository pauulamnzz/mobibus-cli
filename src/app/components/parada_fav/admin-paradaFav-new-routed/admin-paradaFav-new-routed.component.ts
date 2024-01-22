import { Component, OnInit } from '@angular/core';
import { AdminParadaFavFormUnroutedComponent } from '../admin-paradaFav-form-unrouted/admin-paradaFav-form-unrouted.component';

@Component({
  selector: 'app-admin-paradaFav-new-routed',
  templateUrl: './admin-paradaFav-new-routed.component.html',
  styleUrls: ['./admin-paradaFav-new-routed.component.css'],
  standalone: true,
  imports: [
    AdminParadaFavFormUnroutedComponent
  ]

})
export class AdminParadaFavNewRoutedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
