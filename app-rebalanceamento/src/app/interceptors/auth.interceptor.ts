import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getAuthToken();

    // Clonar a requisição original e substituir o cabeçalho de autorização
    const authReq = req.clone({
      headers: new HttpHeaders({
        // 'Access-Control-Request-Method': 'GET,POST,DELETE,PUT',
        'Access-Control-Allow-Origin' : '*',
        'Authorization': `Bearer 123`,
        // 'Authorization': `Bearer ${authToken}`,
        'Content-Type' : 'application/json',
       })
    });
    // req.headers.set('Authorization', `Bearer ${authToken}`)

    // Enviar a requisição clonada com o cabeçalho de autorização
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.status)
        console.log(error.message)
        if (error.status === 401) {
        }
        return throwError(()=>error);
      })
    );
  }
}
