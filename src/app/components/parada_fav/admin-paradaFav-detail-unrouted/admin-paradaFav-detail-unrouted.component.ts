import { Component, Input, OnInit, Optional } from '@angular/core';
import { IParadaFav } from '../../../model/model.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-paradaFav-detail-unrouted',
  templateUrl: './admin-paradaFav-detail-unrouted.component.html',
  styleUrls: ['./admin-paradaFav-detail-unrouted.component.scss'],
  standalone: true,
  imports: [
    RouterModule
  ]
})
export class AdminParadaFavDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;

  oParadaFav: IParadaFav = { user: {} } as IParadaFav;
  status: HttpErrorResponse | null = null;

  constructor(
    private oParadaFavAjaxService: ParadaFavAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig,
    private location: Location,
    private oRouter: Router
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
    this.oParadaFavAjaxService.
    getOne(this.id).subscribe({
      next: (data: IParadaFav) => {
        this.oParadaFav = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }

  goBack() {
    this.oRouter.navigate(["/admin/paradaFav/plist"]);
    }
}
