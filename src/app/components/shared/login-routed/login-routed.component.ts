import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { CryptoService } from '../../../services/crypto.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login-routed',
  standalone: true,
  templateUrl: './login-routed.component.html',
  styleUrls: ['./login-routed.component.css'],
 imports:[
  FormsModule, 
  ReactiveFormsModule,
  ButtonModule,
  MessagesModule,
  DynamicDialogModule
]
})
export class LoginRoutedComponent implements OnInit {

  loginForm: FormGroup;
  status: HttpErrorResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private oSessionService: SessionAjaxService,
    private oMessageService: MessageService, 
    private oRouter: Router,
    private oCryptoService: CryptoService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
   }
   lostFocus = {
    username: false,
    password: false
  
  };
  ngOnInit() {
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.oSessionService.login(this.loginForm.value.username, this.oCryptoService.getSHA256(this.loginForm.value.password)).subscribe({
        next: (data: string) => {
          this.oSessionService.setToken(data);
          this.oSessionService.emit({ type: 'login' });
          this.oMessageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Logged in successfully.' });
          this.oRouter.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'Error in login operation.' }); 
       console.log(error);
        }
      });
    }
  }

  onReset() {
    this.loginForm.reset();
  }

  loginAdmin() {
    this.loginForm.patchValue({
      username: 'Pepa',
      password: 'foxforum'
    });
  }

  loginUser() {
    this.loginForm.patchValue({
      username: 'Pepe',
      password: 'foxforum'
    });
}
}
