import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
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
            return true; // No token payload, allow access
          }
          const decodedToken: any = JSON.parse(atob(payload));
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp > currentTime) {
            // Token is valid, redirect to dashboard
            this.router.navigate(['/dashboard']);
            return false;
          }
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
    }
    return true; // No token, allow access
  }
}