import { Component, Input, OnInit } from '@angular/core';
import { IParadaFav, formOperation } from '../../../model/model.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ParadaFavAjaxService } from '../../../services/paradaFav.ajax.service';

@Component({
  selector: 'app-admin-paradaFav-form-unrouted',
  templateUrl: './admin-paradaFav-form-unrouted.component.html',
  styleUrls: ['./admin-paradaFav-form-unrouted.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
})
export class AdminParadaFavFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit


  paradaFavForm!: FormGroup;
  oParadaFav: IParadaFav = {} as IParadaFav;
  status: HttpErrorResponse | null = null;
  
  constructor(
    private oFormBuilder: FormBuilder,
    private oParadaFavAjaxService: ParadaFavAjaxService,
    private oRouter: Router,
    private oMessageService: MessageService
  ) {
    this.initializeForm(this.oParadaFav);

   }
   initializeForm(oParadaFav: IParadaFav) {
    this.paradaFavForm = this.oFormBuilder.group({
      id: [oParadaFav.id],
      denominacion: [oParadaFav.denominacion, [Validators.required, Validators.minLength(3), Validators.maxLength(15), ]],
      id_parada_api: [oParadaFav.id_parada_api, [Validators.required, Validators.pattern('^[0-9]+$'), ]],
      
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
            this.oParadaFav = data;
            this.initializeForm(this.oParadaFav);
            // avisar al usuario que se ha creado correctamente
            this.oMessageService.add({ severity: 'info', summary: 'Usuario creado', life: 2000 });
            this.oRouter.navigate(['/admin', 'user', 'view', this.oParadaFav]);
            this.paradaFavForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary: 'No se pudo crear el usuario', life: 2000 });
          }
        })

      } else {
        this.oParadaFavAjaxService.updateOne(this.paradaFavForm.value).subscribe({
          next: (data: IParadaFav) => {
            this.oParadaFav = data;
            this.initializeForm(this.oParadaFav);
            // avisar al usuario que se ha actualizado correctamente
            this.oMessageService.add({ severity: 'info', summary: 'Se ha actualizado el usuario', life: 2000 });
            this.oRouter.navigate(['/admin', 'user', 'view', this.oParadaFav.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary: 'No se ha podido actualizar el usuario', life: 2000 });
          }
        })
      }
    }
  }
  lostFocus = {
    denominacion: false,
    id_parada_api: false,
  


  };
}
