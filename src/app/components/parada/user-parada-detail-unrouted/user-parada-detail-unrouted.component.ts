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
  oParadaEmt: IParadaEmt[] = [];

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
    this.oApiEmtAjaxService.
      getInfoLlegadas(this.id).subscribe({
        next: (data: IParadaEmt) => {
          this.oParadaEmt = [data];
          console.log(this.oParadaEmt);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        }
      })
  }
}
