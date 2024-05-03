import { Component, Input, OnInit } from '@angular/core';
import {UserLineaImgUnroutedComponent}  from '../user-linea-img-unrouted/user-linea-img-unrouted.component';
import { ApiEmtService } from '../../../services/api-emt.service';
import { ActivatedRoute } from '@angular/router';
import { UserLineaImgErrorUnroutedComponent } from '../user-linea-img-error-unrouted/user-linea-img-error-unrouted.component';
@Component({
  selector: 'app-user-linea-img-routed',
  templateUrl: './user-linea-img-routed.component.html',
  styleUrls: ['./user-linea-img-routed.component.css'],
  standalone: true,
  imports: [
    UserLineaImgUnroutedComponent,
    UserLineaImgErrorUnroutedComponent
  ]
})
export class UserLineaImgRoutedComponent implements OnInit {
  linea: number = 1;
  
  
  constructor(
    private oApiEmtService: ApiEmtService,
    private oActivatedRoute: ActivatedRoute

  ) {
    this.linea = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }
  ngOnInit() {

  }
  

}
