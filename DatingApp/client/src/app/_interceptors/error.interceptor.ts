import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e) {
          switch (e.status) {
            case 400:
              if (e.error.errors) {
                const modelStateErrors: string[] = []
                for (const key in e.error.errors) {
                  modelStateErrors.push(e.error.errors[key])
                }
                throw modelStateErrors.flat();
              }
              else {
                this.toastr.error(e.error, e.status.toString());
              }
              break;
            case 401:
              this.toastr.error('Unauthorized', e.status.toString());
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = { state: { error: e.error } };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(e);
              break;
          }
        }
        throw e;
      })
    );
  }
}
