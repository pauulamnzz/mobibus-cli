import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { ApiEmtService } from '../../../services/api-emt.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IParadaEmt } from '../../../model/model.interface';

@Component({
  selector: 'app-user-parada-detail-unrouted',
  templateUrl: './user-parada-detail-unrouted.component.html',
  styleUrls: ['./user-parada-detail-unrouted.component.css'],
  standalone: true,
  imports:[
    
  ]
})
export class UserParadaDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;

  status: HttpErrorResponse | null = null;
  oParadaEmt: IParadaEmt[]= [];
buses: IParadaEmt[] = [];
  constructor(
    private oApiEmtAjaxService: ApiEmtService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
  }

  ngOnInit() {
    this.getOne();
  }
  getOne(): void {
    this.oApiEmtAjaxService.getInfoLlegadas(this.id).subscribe({
      next: (data: IParadaEmt[][]) => { // Aquí esperamos un array anidado
        // Verificamos si hay datos y si el primer elemento del array es un array
        if (data && Array.isArray(data[0])) {
          // Si es un array anidado, asignamos directamente el primer elemento a oParadaEmt
          this.oParadaEmt = data[0];
          console.log(this.oParadaEmt);
        } else {
          // Si no es un array anidado, asignamos los datos como están
          console.log(this.oParadaEmt);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
}
