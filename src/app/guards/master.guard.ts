import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MasterGuard implements CanActivate {

  constructor(private router : Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(localStorage.getItem('master_token')) {
      return true;
    }
    else {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/session/signin/master']);
      return false;
    }
  }

}