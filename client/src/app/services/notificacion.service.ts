import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  notification = new EventEmitter<string | null>(); 

  showNotification(message: string) {
    console.log('Emitiendo notificación:', message);
    this.notification.emit(message);
    setTimeout(() => {
      this.notification.emit(null);  
    }, 3000);
  }
}
