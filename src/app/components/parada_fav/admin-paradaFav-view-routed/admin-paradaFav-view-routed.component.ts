import { Component, OnInit } from '@angular/core';
import { AdminParadaFavDetailUnroutedComponent } from '../admin-paradaFav-detail-unrouted/admin-paradaFav-detail-unrouted.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-paradaFav-view-routed',
  templateUrl: './admin-paradaFav-view-routed.component.html',
  styleUrls: ['./admin-paradaFav-view-routed.component.css'],
  standalone: true,
  imports: [
  AdminParadaFavDetailUnroutedComponent
  ]
})
export class AdminParadaFavViewRoutedComponent implements OnInit {
  id: number = 1;
  status: HttpErrorResponse | null = null;
  constructor(
    private oActivatedRoute: ActivatedRoute,
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

   }

  ngOnInit() {
  }

}
