import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-linea-img-unrouted',
  templateUrl: './user-linea-img-unrouted.component.html',
  styleUrls: ['./user-linea-img-unrouted.component.css'],
  standalone: true,
  imports: [
  ]
})
export class UserLineaImgUnroutedComponent implements OnInit {
  imageUrl: string | undefined;
  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) { }
  ngOnInit() {
    this.imageUrl = this.config.data?.imageUrl;  }

}
