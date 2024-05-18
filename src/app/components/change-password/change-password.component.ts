import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EmailPasswordService } from '../../services/emailPassword.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../services/crypto.service';
import { ChangePasswordDto } from '../../model/model.emailValuesDto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  standalone: true,
  imports: [
ReactiveFormsModule 
  ]
})
export class ChangePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup; 
  tokenPassword: string | null = ''; 
  constructor(
    private oEmailPasswordService: EmailPasswordService,
    private oRouter: Router,
    private oCryptoService: CryptoService, 
    private oActivatedRoute: ActivatedRoute,
    private fb: FormBuilder, 
    private oMessageService: MessageService
  ) { 
    this.updatePasswordForm = this.fb.group({ 
      password: ['', [Validators.required]], 
      confirmPassword: ['', [Validators.required]], 
    });
  }

  ngOnInit() {
  }
  onSubmit() {
    if (this.updatePasswordForm.get('password')?.value != this.updatePasswordForm.get('confirmPassword')?.value) {
     // this.oMatSnackBar.open('Passwords do not match', 'OK', { duration: 3000 });
     this.oMessageService.add({severity:'error', summary:'Error', detail:'Les contrasenyes no coincideixen'}); 
     return;
    }

    this.tokenPassword = this.oActivatedRoute.snapshot.paramMap.get('tokenPassword'); //Check

    const cryptedPassword = this.oCryptoService.getSHA256(this.updatePasswordForm.get('password')?.value);

    const oChangePasswordDto = new ChangePasswordDto(cryptedPassword, cryptedPassword, this.tokenPassword);

    this.oEmailPasswordService.changePassword(oChangePasswordDto).subscribe({
      next: (data: string) => {
       // this.oMatSnackBar.open('Password Updated', 'OK', { duration: 2000 });
        this.oMessageService.add({severity:'success', summary:'Èxit', detail:'Contrasenya restablerta correctament'}); 
       this.oRouter.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
       // this.oMatSnackBar.open('Error updating password', 'OK', { duration: 2000 });
      this.oMessageService.add({severity:'error', summary:'Error', detail:'Error en restablir la contrasenya'});
      }
    });
  }
}
