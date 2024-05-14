import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { MessageService } from 'primeng/api';
import { CryptoService } from '../../../services/crypto.service';
import { Router } from '@angular/router';
import { IUser } from '../../../model/model.interface';
import { UserAjaxService } from '../../../services/user.ajax.service';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signIn-routed',
  templateUrl: './signIn-routed.component.html',
  styleUrls: ['./signIn-routed.component.css'],
  imports: [
    ReactiveFormsModule,
   CommonModule
  ],
  standalone: true,

})
export class SignInRoutedComponent implements OnInit {
  signInForm!: FormGroup;
  status: HttpErrorResponse | null = null;
  oUser: IUser = {} as IUser;


  constructor(
    private fb: FormBuilder,
    private oSessionService: SessionAjaxService,
    private oMessageService: MessageService, 
    private oRouter: Router,
    private oCryptoService: CryptoService,
    private oUserAjaxService: UserAjaxService,

  ) { 
    this.initializeForm(this.oUser);

  }

  initializeForm(oUser: IUser) {
    this.signInForm = this.fb.group({
      id: [oUser.id],
      username: [oUser.username, [Validators.required, Validators.minLength(3), Validators.maxLength(15),],
        this.usernameExists(this.oUserAjaxService)],
        password: [oUser.password, [Validators.required, Validators.minLength(5)]],
      email: [oUser.email, [Validators.required, Validators.email],
        this.emailExists(this.oUserAjaxService)],
    
    });
  }
  lostFocus = {
    username: false,
    password: false,
    email: false
  
  };
  ngOnInit() {
    this.initializeForm(this.oUser);

  }
  public hasError = (controlName: string, errorName: string) => {
    return this.signInForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    // Verifica si el formulario de registro es válido
    if (this.signInForm.valid) {
      // Hashea la contraseña ingresada por el usuario
      const hashedPassword = this.oCryptoService.getSHA256(this.signInForm.value.password);
      // Crea un nuevo objeto de usuario con la contraseña hasheada
      const newUser = {
        ...this.signInForm.value,
        password: hashedPassword
      };
  
      // Realiza una solicitud de registro al servicio de usuario
      this.oUserAjaxService.newForUsers(newUser).subscribe({
        next: (data: IUser) => {
          // Almacena los datos del usuario registrado
          this.oUser = data;
          // Muestra un mensaje de éxito al usuario
          //this.oMessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Te has registrado correctamente', life: 2000 });
          // Redirige al usuario a la página de inicio
          this.oRouter.navigate(['/home']);
  
          // Inicia sesión automáticamente después del registro
          this.oSessionService.login(this.signInForm.value.username, this.oCryptoService.getSHA256(this.signInForm.value.password)).subscribe({
            next: (loginData: string) => {
              // Guarda el token de sesión
              this.oSessionService.setToken(loginData);
              // Emite un evento de inicio de sesión
              this.oSessionService.emit({ type: 'login' });
              // Muestra un mensaje de éxito por la sesión iniciada
              this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'T\'has registrat correctament' });
              // Redirige al usuario a la página de inicio
              this.oRouter.navigate(['/home']);
            },
            error: (loginError: HttpErrorResponse) => {
              // Maneja el error si no se puede iniciar sesión automáticamente después del registro
              this.status = loginError;
              this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'No s\'ha pogut crear el compte' });
            }
          });
  
          // Reinicia el formulario de registro
          this.signInForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          // Maneja el error si no se puede crear el usuario
          this.status = error;
          this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'No s\'ha pogut crear el compte', life: 2000 });
        }
      });
    }
  }
  




  usernameExists(userService: UserAjaxService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return userService.existsByUsername(control.value).pipe(
        map(exists => exists ? { usernameExists: true } : null),
        catchError(() => of(null))
      );
    };
  }

   emailExists(userService: UserAjaxService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return userService.existsByEmail(control.value).pipe(
        map(exists => exists ? { emailExists: true } : null),
        catchError(() => of(null))
      );
    };
  }

}
