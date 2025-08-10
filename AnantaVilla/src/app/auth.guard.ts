import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      const isLoginRoute = route.routeConfig?.path === 'Login';

      // Redirect logged-in users away from the Login page
      if (user && isLoginRoute) {
        this.router.navigate(['/Home']);
        return false;
      }

      // Redirect non-logged-in users away from protected routes
      if (!user && !isLoginRoute) {
        this.router.navigate(['/Login']);
        return false;
      }

      // Allow access
      return true;
    }
    return false;
  }
}