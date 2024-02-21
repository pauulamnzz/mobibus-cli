import { Component, Input, OnInit } from '@angular/core';
import { IUser, formOperation } from '../../../model/model.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-form-unrouted',
  standalone: true,
  templateUrl: './admin-user-form-unrouted.component.html',
  styleUrls: ['./admin-user-form-unrouted.component.scss'],
  imports: [
    ReactiveFormsModule,
   CommonModule
  ],
})
export class AdminUserFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit

  showRoleError: boolean = false;
  selectedRole: boolean = false;
  userForm!: FormGroup;
  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;
  constructor(
    private oFormBuilder: FormBuilder,
    private oUserAjaxService: UserAjaxService,
    private oRouter: Router,
    private oMessageService: MessageService

  ) {
    this.initializeForm(this.oUser);

  }
  initializeForm(oUser: IUser) {
    this.userForm = this.oFormBuilder.group({
      id: [oUser.id],
      username: [oUser.username, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern('^[a-zA-Z]+$'), ]],
      email: [oUser.email, [Validators.required, Validators.email]],
      role: [oUser.role, Validators.required]
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oUserAjaxService.getOne(this.id).subscribe({
        next: (data: IUser) => {
          this.oUser = data;
          this.selectedRole = this.oUser.role;
          this.initializeForm(this.oUser);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMessageService.add({ severity: 'error', summary: 'Error', life: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oUser);
    }
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }
  onSubmit() {
    if (this.userForm.valid) {
      if (this.operation == 'NEW') {
        this.oUserAjaxService.newOne(this.userForm.value).subscribe({
          next: (data: IUser) => {       
            this.oUser = data;
            this.initializeForm(this.oUser);
            // avisar al usuario que se ha creado correctamente
            this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'S\'ha creat el nou usuari',life: 2000 });
            this.oRouter.navigate(['/admin', 'user', 'view', this.oUser]);
            this.userForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary: ' Error', detail:'No s\'ha pogut crear l\'usuari', life: 2000 });
          }
        })

      } else {
        this.oUserAjaxService.updateOne(this.userForm.value).subscribe({
          next: (data: IUser) => {
            this.oUser = data;
            this.initializeForm(this.oUser);
            // avisar al usuario que se ha actualizado correctamente
            this.oMessageService.add({ severity: 'success', summary:"Èxit",detail: 'L\'usuari s\'ha actualitzat', life: 2000 });
            this.oRouter.navigate(['/admin', 'user', 'view', this.oUser.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary:"Error", detail: 'No s\'ha pogut actualizar l\'usuari', life: 2000 });
          }
        })
      }
    }
  }
  lostFocus = {
    username: false,
    email: false,
    role: false,


  };



}
