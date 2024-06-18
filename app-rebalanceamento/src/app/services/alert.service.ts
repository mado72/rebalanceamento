import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval, map, skipWhile } from 'rxjs';

export interface Alert {
  tipo: 'http' | 'common' | 'sucesso' | 'erro' | undefined;
  titulo: string;
  mensagem: string;
  wait?: Date;
}
@Injectable({
  providedIn: 'root'
})
export class AlertService implements OnDestroy {

  private alerts: Alert[] = [];

  private readonly bufferDuration = 250; // 1 second interval

  private alertSubscription!: Subscription;

  constructor(private toastrService: ToastrService) {
    this.alertSubscription = interval(this.bufferDuration)
      .pipe(
        map(() => {
          if (!this.alerts.length) {
            return undefined;
          }
          return this.alerts.shift();
        }),
        skipWhile(alert=>alert !== undefined),
      )
      .subscribe(alerta => {
        if (alerta !== undefined) {
          const config = {
            positionClass: 'toast-bottom-right',
            timeOut: alerta.wait ? alerta.wait.getTime() : 5000,
            closeButton: true,
            progressBar: true,
            tapToDismiss: true,
            extendedTimeOut: 0,
            enableHtml: true,
          };
          switch (alerta.tipo) {
            case 'http':
            case 'erro':
              this.toastrService.error(
                alerta.mensagem,
                alerta.titulo,
                config
              );
              break;
            case 'sucesso':
              this.toastrService.success(
                alerta.mensagem,
                alerta.titulo,
                config
              )
              break;
            default:
              this.toastrService.info(
                alerta.mensagem,
                alerta.titulo,
                config
              );
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
  }

  alert(alert: Alert) {
    if (alert.tipo != 'http') {
      this.alerts = this.alerts.filter(alert => alert.tipo != 'http');
    }
    this.alerts.push(alert)
  }



}
