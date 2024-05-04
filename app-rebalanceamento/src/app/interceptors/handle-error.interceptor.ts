import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AlertService } from '../services/alert.service';

@Injectable()
export class HandleErrorInterceptor implements HttpInterceptor {

  constructor(private alertService: AlertService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError( (httpError: HttpErrorResponse) =>{
        console.error(httpError.error);
        this.alertService.alert({
          tipo: 'http',
          mensagem: httpError.error?.message || httpError.message,
          titulo: 'Erro na requisição'
        })
        throw `${httpError.message}.<br>\nDetalhe: ${httpError.error?.message || ''}`;
      })
    );
  }
}
