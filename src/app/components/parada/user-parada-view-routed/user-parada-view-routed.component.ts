import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserParadaDetailUnroutedComponent } from '../user-parada-detail-unrouted/user-parada-detail-unrouted.component';

@Component({
  selector: 'app-user-parada-view-routed',
  templateUrl: './user-parada-view-routed.component.html',
  styleUrls: ['./user-parada-view-routed.component.scss'],
  standalone: true,
  imports:[
    UserParadaDetailUnroutedComponent
  ]
})
export class UserParadaViewRoutedComponent implements OnInit {
  id: number = 1;
  constructor(
    private oActivatedRoute: ActivatedRoute,

  ) { 
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }

  ngOnInit() {
  }

}
