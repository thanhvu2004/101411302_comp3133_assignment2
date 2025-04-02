import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = token.split('.')[1];
          if (!payload) {
            return false;
          }
          const decodedToken: any = JSON.parse(atob(payload));
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp > currentTime) {
            return true; // Token is valid
          }
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}