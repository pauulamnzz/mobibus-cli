import { Router, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SessionAjaxService } from '../../../services/session.ajax.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-logout-routed',
  templateUrl: './logout-routed.component.html',
  styleUrls: ['./logout-routed.component.scss'],

})
export class LogoutRoutedComponent implements OnInit {

  constructor(
    private oSessionService: SessionAjaxService,
    private oRouter: Router,
    private oMessageService: MessageService

  ) { }

  ngOnInit() {
  }
  logout() {
    this.oSessionService.logout();
    this.oSessionService.emit({ type: 'logout' });
    this.oMessageService.add({ severity: 'success', summary: 'Èxit', detail: 'Sessió tancada' });
    this.oRouter.navigate(['/home']);
  }

  cancel() {
    this.oRouter.navigate(['/home']);
    this.oMessageService.add({ severity: 'error', summary: 'Error', detail: 'No s\'ha pogut eixir de la sessió' });
  }
}
