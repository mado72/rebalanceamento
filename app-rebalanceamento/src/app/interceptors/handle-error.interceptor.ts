import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class HandleErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError( (httpError: HttpErrorResponse) =>{
        console.error(httpError.error);
        throw `${httpError.message}. ${httpError.error?.message || ''}`;
      })
    );
  }
}
