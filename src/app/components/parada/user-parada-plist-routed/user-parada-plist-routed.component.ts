import { Component, OnInit } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-parada-plist-routed',
  templateUrl: './user-parada-plist-routed.component.html',
  styleUrls: ['./user-parada-plist-routed.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]

})
export class UserParadaPlistRoutedComponent implements OnInit {
paradas: string[] = [];
searchTerm: string = '';
filterParadas: string[] = [];


  constructor(
    private ApiEmtService: ApiEmtService
    ) { }

  ngOnInit() {
    this.ApiEmtService.getAllParadas().subscribe(result => {
      this.paradas = result;
      this.filterParadas = result;
      console.log(result);
    });
  }
  search() {
    if (this.searchTerm) {
      this.paradas = this.filterParadas.filter(parada =>
        parada.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.paradas = this.filterParadas;
    }
  }
}
