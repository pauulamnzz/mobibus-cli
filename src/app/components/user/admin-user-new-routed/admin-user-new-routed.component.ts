import { Component, OnInit } from '@angular/core';
import {AdminUserFormUnroutedComponent} from '../admin-user-form-unrouted/admin-user-form-unrouted.component';
@Component({
  selector: 'app-admin-user-new-routed',
  templateUrl: './admin-user-new-routed.component.html',
  styleUrls: ['./admin-user-new-routed.component.scss'],
  standalone: true,
  imports: [
    AdminUserFormUnroutedComponent
  ]
})
export class AdminUserNewRoutedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
