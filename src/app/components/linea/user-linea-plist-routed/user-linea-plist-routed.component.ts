import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ApiEmtService } from '../../../services/api-emt.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-linea-plist-routed',
  templateUrl: './user-linea-plist-routed.component.html',
  standalone: true,
  styleUrls: ['./user-linea-plist-routed.component.css'],


  imports: [
    CommonModule,
    FormsModule


  ]
})
export class UserLineaPlistRoutedComponent implements OnInit {
  constructor(private ApiEmtService: ApiEmtService) { }
  lineas: string[] = [];

  ngOnInit() {
this.ApiEmtService.getAllLineas().subscribe(result => {
  this.lineas = result;
  console.log(result);


  });
// this.ApiEmtService.getAll().subscribe(result => {
//  console.log(result);

//   });



}


}