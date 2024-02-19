import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParadaComunicationService {
  private updateParadasFavoritasSource = new Subject<void>();
  updateParadasFavoritas$ = this.updateParadasFavoritasSource.asObservable();
  constructor() { }
  triggerUpdateParadasFavoritas() {
    this.updateParadasFavoritasSource.next();
  }
}
