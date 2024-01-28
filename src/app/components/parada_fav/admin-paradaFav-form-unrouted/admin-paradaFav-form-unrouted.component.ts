import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IParadaFav, IUser, formOperation } from '../../../model/model.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminUserSelectionUnroutedComponent } from '../../user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';

@Component({
  selector: 'app-admin-paradaFav-form-unrouted',
  templateUrl: './admin-paradaFav-form-unrouted.component.html',
  styleUrls: ['./admin-paradaFav-form-unrouted.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AdminUserSelectionUnroutedComponent
   
  ],
})
export class AdminParadaFavFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit
  paradaFavForm!: FormGroup;
  oParadaFav: IParadaFav = { user: {} } as IParadaFav;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  showErrorOnClose: boolean = false;
  lostFocus = {
    alias: false,
    id_parada: false,
    user: false,

  }
  constructor(
    private oFormBuilder: FormBuilder,
    private oParadaFavAjaxService: ParadaFavAjaxService,
    private oRouter: Router,
    private oMessageService: MessageService,
    public oDialogService: DialogService
  ) {
    this.initializeForm(this.oParadaFav);
   }


  initializeForm(oParadaFav: IParadaFav) {
    this.paradaFavForm = this.oFormBuilder.group({
      id: [oParadaFav.id],
      alias: [oParadaFav.alias, [Validators.required, Validators.minLength(3), Validators.maxLength(15) ]],
      id_parada: [oParadaFav.id_parada, [Validators.required]],
      user: this.oFormBuilder.group({
        id: [oParadaFav.user.id, Validators.required]      
      })
    });
  }
  ngOnInit() {
   
    if (this.operation == 'EDIT') {
      this.oParadaFavAjaxService.getOne(this.id).subscribe({
        next: (data: IParadaFav) => {
          this.oParadaFav = data;
          this.initializeForm(this.oParadaFav);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMessageService.add({ severity: 'error', summary: 'Error', life: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oParadaFav);
    }
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.paradaFavForm.controls[controlName].hasError(errorName);
  }
  onSubmit() {
    if (this.paradaFavForm.valid) {
      if (this.operation == 'NEW') {
        this.oParadaFavAjaxService.newOne(this.paradaFavForm.value).subscribe({
          next: (data: IParadaFav) => {
            this.oParadaFav = { "user": {} } as IParadaFav;
            this.initializeForm(this.oParadaFav);
            this.oMessageService.add({ severity: 'info', summary: 'Agente creado', life: 2000 });
            this.oRouter.navigate(['/admin', 'paradaFav', 'view', data]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
          
            this.oMessageService.add({ severity: 'error', summary: 'No se pudo crear el agente', life: 2000 });
          }
        });
      } else {
        this.oParadaFavAjaxService.updateOne(this.paradaFavForm.value).subscribe({
          next: (data: IParadaFav) => {
            this.oParadaFav = data;
            this.initializeForm(this.oParadaFav);
            this.oMessageService.add({ severity: 'info', summary: 'Se ha actualizado el agente', life: 2000 });
            this.oRouter.navigate(['/admin', 'paradaFav', 'view', this.oParadaFav.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary: 'No se ha podido actualizar el agente', life: 2000 });
          }
        });
      }
    }
  }



    onShowUsersSelection() {
     this.showErrorOnClose = true;
  
    this.oDynamicDialogRef = this.oDialogService.open(AdminUserSelectionUnroutedComponent, {
      header: 'Select a User',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((oUser: IUser) => {
      this.showErrorOnClose = false;
      if (oUser) {
        this.oParadaFav.user = oUser;
        this.paradaFavForm.controls['user'].patchValue({ id: oUser.id })
        this.lostFocus.user = false; 

      }else{
        this.lostFocus.user = true; 
      }
    });
  } 
  onIdFieldBlurU() {
    if (this.showErrorOnClose) {
      this.lostFocus.user = true;
    }
  }
}
