import { Injectable, OnDestroy } from '@angular/core';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber, Subscription, bufferTime, filter, interval, map, mergeAll, mergeMap, scan, skipWhile, takeUntil } from 'rxjs';

export interface Alert {
  tipo: 'http' | 'common' | 'sucesso' | undefined;
  titulo: string;
  mensagem: string;
  wait?: DateTime;
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
        skipWhile(alert=>alert !== undefined)
      )
      .subscribe(alert => {
        if (alert !== undefined) {
          const tipo = alert.tipo == 'http' ? 'error' : alert.tipo == 'sucesso' ? 'success' : 'info';
          const config = {
            positionClass: 'toast-bottom-right',
            timeOut: alert.wait ? alert.wait.toMillis() : 5000,
            closeButton: true,
            progressBar: true,
            tapToDismiss: true,
            extendedTimeOut: 0,
            enableHtml: true,
          };
          switch (alert.tipo) {
            case 'http':
              this.toastrService.error(
                alert.mensagem,
                alert.titulo,
                config
              );
              break;
            case 'sucesso':
              this.toastrService.success(
                alert.mensagem,
                alert.titulo,
                config
              )
              break;
            default:
              this.toastrService.info(
                alert.mensagem,
                alert.titulo,
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
    this.alerts.push(alert)
  }



}
