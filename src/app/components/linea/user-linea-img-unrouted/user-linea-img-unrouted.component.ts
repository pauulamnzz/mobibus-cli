import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserLineaImgRoutedComponent } from '../user-linea-img-routed/user-linea-img-routed.component';

@Component({
  selector: 'app-user-linea-img-unrouted',
  templateUrl: './user-linea-img-unrouted.component.html',
  styleUrls: ['./user-linea-img-unrouted.component.css'],
  standalone: true,
  imports: [
    UserLineaImgRoutedComponent
  ]
})
export class UserLineaImgUnroutedComponent implements OnInit {
  imageUrl: string | undefined;
  @Input() linea: number = 95;

  constructor(
     private config: DynamicDialogConfig
  ) { }
  ngOnInit() {
  this.imageUrl = this.config.data?.imageUrl;
  }




}
