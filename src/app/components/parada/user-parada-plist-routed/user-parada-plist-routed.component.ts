import { Component, OnInit } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';

@Component({
  selector: 'app-user-parada-plist-routed',
  templateUrl: './user-parada-plist-routed.component.html',
  styleUrls: ['./user-parada-plist-routed.component.css']
})
export class UserParadaPlistRoutedComponent implements OnInit {
paradas: string[] = [];



  constructor(
    private ApiEmtService: ApiEmtService
    ) { }

  ngOnInit() {
    this.ApiEmtService.getAllParadas().subscribe(result => {
      this.paradas = result;
      console.log(result);
    });
  }

}
