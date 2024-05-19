import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLineaImgErrorUnroutedComponent } from '../user-linea-img-error-unrouted/user-linea-img-error-unrouted.component';

@Component({
  selector: 'app-user-linea-img-error-routed',
  templateUrl: './user-linea-img-error-routed.component.html',
  styleUrls: ['./user-linea-img-error-routed.component.css'],
  standalone: true,
  imports: [
    UserLineaImgErrorUnroutedComponent
  ]
})
export class UserLineaImgErrorRoutedComponent implements OnInit {
  linea: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router

  ) { 
    this.linea = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }
  goBack() {
    this.oRouter.navigate(["user/linea/plist"]);
  }
  ngOnInit() {

  }

}
