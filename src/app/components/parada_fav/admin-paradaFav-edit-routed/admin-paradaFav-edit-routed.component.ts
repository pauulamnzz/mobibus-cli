import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminParadaFavFormUnroutedComponent } from '../admin-paradaFav-form-unrouted/admin-paradaFav-form-unrouted.component';

@Component({
  selector: 'app-admin-paradaFav-edit-routed',
  templateUrl: './admin-paradaFav-edit-routed.component.html',
  styleUrls: ['./admin-paradaFav-edit-routed.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    AdminParadaFavFormUnroutedComponent

  ]
})
export class AdminParadaFavEditRoutedComponent implements OnInit {
  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute

  ) { 
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }

  ngOnInit(
    
  ) {
  }

}
