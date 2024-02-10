import { HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../../../model/model.interface';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-user-detail-unrouted',
  templateUrl: './admin-user-detail-unrouted.component.html',
  styleUrls: ['./admin-user-detail-unrouted.component.scss'],
  standalone: true,
  imports: [
  RouterModule
  ],

})
export class AdminUserDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;
  constructor(
    private oUserAjaxService: UserAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config){
      if (config.data){
        this.id = config.data.id;
      }
    }
   }

  ngOnInit() {
    this.getOne();

  }
  getOne(): void {
    this.oUserAjaxService.getOne(this.id).subscribe({
      next: (data: IUser) => {
        this.oUser= data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }
}
