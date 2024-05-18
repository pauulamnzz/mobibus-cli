import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailPasswordService } from '../../services/emailPassword.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { EmailValuesDto } from '../../model/model.changePasswordDto';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule
  ]
})
export class SendEmailComponent implements OnInit {
  sendEmailForm: FormGroup;

  constructor(
    private oMessageService: MessageService,
    private oEmailPasswordService: EmailPasswordService,
    private fb: FormBuilder,
    private oRouter: Router,
  ) { 
    this.sendEmailForm = this.fb.group({
      mailTo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }


  onSubmit() {
    const mailTo = this.sendEmailForm.get('mailTo')?.value;
    this.oEmailPasswordService.sendEmail(new EmailValuesDto(mailTo)).subscribe({
        next: (data: string) => {
         //   this.oMatSnackBar.open('Email sent', 'OK', { duration: 2000 });
         this.oMessageService.add({severity:'success', summary:'Èxit', detail:'Correu enviat correctament'});         this.oRouter.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
           // this.oMatSnackBar.open('Error sending email', 'OK', { duration: 2000 });
           this.oMessageService.add({severity:'error', summary:'Error', detail:'Error en enviar el correu'});
        }
    });
}
}
