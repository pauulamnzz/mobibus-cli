import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IParadaFav, IUser } from '../../../model/model.interface';
import { ParadaFavAjaxService } from '../../../services/parada.fav.ajax.service';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-parada-form-unrouted',
  templateUrl: './user-parada-form-unrouted.component.html',
  styleUrls: ['./user-parada-form-unrouted.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
})
export class UserParadaFormUnroutedComponent implements OnInit {
  status: HttpErrorResponse | null = null;
  @Input() id: number = 1;
  paradaForm!: FormGroup;
  oParadaFav: IParadaFav = {} as IParadaFav;
  data: any;


  constructor(
    private oFormBuilder: FormBuilder,
    private oRouter: Router,
    private oMessageService: MessageService,
    private oSessionAjaxService: SessionAjaxService,
    private oParadaFavAjaxService: ParadaFavAjaxService,
    @Optional() public config: DynamicDialogConfig,
    @Optional() public ref: DynamicDialogRef,


  ) {

    this.initializeForm(this.oParadaFav);

  }

  ngOnInit() {
    this.data = this.config.data;
  }

  initializeForm(oParadaFav: IParadaFav) {
    this.paradaForm = this.oFormBuilder.group({
      id: [oParadaFav.id],
      alias: [oParadaFav.alias, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],

    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.paradaForm.controls[controlName].hasError(errorName);
  }
  lostFocus = {
    alias: false,
  };
  onSubmit() {
    if (this.paradaForm.valid) {
      if (this.ref) {
        const paradaFav: IParadaFav = {
          id: this.paradaForm.get('id')?.value,
          alias: this.paradaForm.get('alias')?.value,
          id_parada: this.data.id_parada,
          user: {
            id: this.data.usuario.id
          } as IUser
        };
        // console.log(paradaFav);

        this.oParadaFavAjaxService.newOne(paradaFav).subscribe({
          next: (parada: IParadaFav) => {
            this.oParadaFav = { "user": {} } as IParadaFav;

            this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'Parada favorita afegida amb èxit' });
            this.ref.close({ success: true });
                    },
          error: (error: any) => {
            this.onCancel();

            this.oMessageService.add({ severity: 'detail',summary: 'Error', detail: 'No s\'ha pogut crear la parada favorita', life: 2000 });
          }
        });

        error: (error: any) => {
          this.onCancel();

          console.error("Error en obtenir l'usuari de la sessió:", error);
        }
      }
    } else {
      this.onCancel();

      console.error("DynamicDialogRef és nul.");
    }
  }
  onCancel() {
    this.ref.close({ success: false });
  }

}
