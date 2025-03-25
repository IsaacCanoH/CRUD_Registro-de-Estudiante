import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private mensaje = new BehaviorSubject<string | null>(null);
  notificacionMensaje$ = this.mensaje.asObservable();

  showNotification(mensaje: string) {
    this.mensaje.next(mensaje);
    setTimeout(() => this.mensaje.next(null), 80000); 
  }
}
