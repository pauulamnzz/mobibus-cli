import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUserDetailUnroutedComponent } from '../admin-user-detail-unrouted/admin-user-detail-unrouted.component';

@Component({
  selector: 'app-admin-user-view-routed',
  templateUrl: './admin-user-view-routed.component.html',
  styleUrls: ['./admin-user-view-routed.component.css'],
  standalone: true,
  imports: [
  AdminUserDetailUnroutedComponent
]
})
export class AdminUserViewRoutedComponent implements OnInit {
  id: number = 1;
  status: HttpErrorResponse | null = null;
  
  constructor(
    private oActivatedRoute: ActivatedRoute,
   // private oParadaFavService: ParadaFavService,
  ) { 
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }

  ngOnInit() {
  }

}
