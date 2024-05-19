import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-linea-img-error-routed',
  templateUrl: './user-linea-img-error-routed.component.html',
  styleUrls: ['./user-linea-img-error-routed.component.css'],
  standalone: true,
  imports: [
  ]
})
export class UserLineaImgErrorRoutedComponent implements OnInit {
  linea: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute,

  ) { 
    this.linea = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }

  ngOnInit() {

  }

}
