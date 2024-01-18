import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUserFormUnroutedComponent } from '../admin-user-form-unrouted/admin-user-form-unrouted.component';

@Component({
  selector: 'app-admin-user-edit-routed',
  standalone: true,
  templateUrl: './admin-user-edit-routed.component.html',
  styleUrls: ['./admin-user-edit-routed.component.css'],
  imports: [
    AdminUserFormUnroutedComponent
  ]

})
export class AdminUserEditRoutedComponent implements OnInit {
  id: number = 1;
  constructor(
    private oActivatedRoute: ActivatedRoute

  ) { 
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }

  ngOnInit() {
  }

}
