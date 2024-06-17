import { Component, Input, OnInit } from '@angular/core';
import { IUser, formOperation } from '../../../model/model.interface';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';
import { UserAjaxService } from '../../../services/user.ajax.service';

@Component({
  selector: 'app-admin-user-form-unrouted',
  standalone: true,
  templateUrl: './admin-user-form-unrouted.component.html',
  styleUrls: ['./admin-user-form-unrouted.component.scss'],
  imports: [
    ReactiveFormsModule,
   
  ],
})
export class AdminUserFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit
  originalUser: IUser = {} as IUser; // Guardar los valores originales
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
      username: [oUser.username, [Validators.required, Validators.minLength(3), Validators.maxLength(15),],
    ],
      email: [oUser.email, [Validators.required, Validators.email],
      ],
      role: [oUser.role, Validators.required]
    });
  }

  
 ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oUserAjaxService.getOne(this.id).subscribe({
        next: (data: IUser) => {
          this.oUser = data;
          this.selectedRole = this.oUser.role;
          this.originalUser = { ...data }; // Clonar los valores originales
          this.initializeForm(this.oUser);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMessageService.add({ severity: 'error', summary: 'Error', life: 2000 });
        }
      });
    } else {
      this.initializeForm(this.oUser);
    }
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }
  goBack() {
    this.oRouter.navigate(["/admin/user/plist"]);
  }
  onSubmit() {
   //  console.log(this.userForm.value);
    if (this.userForm.valid) {
      if (this.operation === 'NEW') {
        this.oUserAjaxService.existsByUsername(this.userForm.value.username).subscribe({
          next: (usernameExists: boolean) => {
            if (usernameExists) {
              this.oMessageService.add({ severity: 'error', summary: 'Error', detail: "El nom d'usuari ja existeix", life: 2000 });
            } else {
              this.oUserAjaxService.existsByEmail(this.userForm.value.email).subscribe({
                next: (emailExists: boolean) => {
                  if (emailExists) {
                    this.oMessageService.add({ severity: 'error', summary: 'Error', detail: "El correu electrònic ja existeix", life: 2000 });
                  } else {
                    this.createUser();
                  }
                },
                error: (error: HttpErrorResponse) => {
                  this.status = error;
                  this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'Error en comprovar el correu electrònic', life: 2000 });
                }
              });
            }
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMessageService.add({ severity: 'error', summary: 'Error', detail: "Error en comprovar el nom d'usuari", life: 2000 });
          }
        });
      } else {
        if (this.isFormUnchanged()) {
          this.oMessageService.add({ severity: 'info', summary: 'Operació cancel·lada', detail: 'Cap camp ha estat actualitzat', life: 2000 });
          this.oRouter.navigate(['/admin', 'user', 'plist']);

        } else {
          this.updateUser();
        }
      }
    }
  }

  private createUser() {
    this.oUserAjaxService.newOne(this.userForm.value).subscribe({
      next: (data: IUser) => {
        this.oUser = data;
        this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'S\'ha creat el nou usuari', life: 2000 });
        this.oRouter.navigate(['/admin', 'user', 'view', this.oUser]);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
        this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'No s\'ha pogut crear l\'usuari', life: 2000 });
      }
    });
  }

  private updateUser() {
    this.oUserAjaxService.updateOne(this.userForm.value).subscribe({
      next: (data: IUser) => {
        this.oUser = data;
        this.initializeForm(this.oUser);
        this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'L\'usuari s\'ha actualitzat', life: 2000 });
        this.oRouter.navigate(['/admin', 'user', 'view', this.oUser.id]);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
        this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'No s\'ha pogut actualitzar l\'usuari', life: 2000 });
      }
    });
  }

  private isFormUnchanged(): boolean {
    return (
      this.originalUser.username === this.userForm.value.username &&
      this.originalUser.email === this.userForm.value.email &&
      this.originalUser.role === this.userForm.value.role
    );
  }

  
  lostFocus = {
    username: false,
    email: false,
    role: false,


  };

 
}
