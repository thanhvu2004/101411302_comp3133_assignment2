import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:5000/graphql';
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  login(usernameOrEmail: string, password: string): Observable<any> {
    const query = `
      query {
        login(usernameOrEmail: "${usernameOrEmail}", password: "${password}")
      }
    `;
    return this.http.post(this.apiUrl, { query });
  }

  signup(userData: any): Observable<any> {
    const mutation = `
      mutation {
        signup(
          username: "${userData.username}",
          email: "${userData.email}",
          password: "${userData.password}"
        )
      }
    `;
    return this.http.post(this.apiUrl, { query: mutation });
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      this.isLoggedInSubject.next(true);
    }
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.isLoggedInSubject.next(false);
    }
  }

  getLoginStatus(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    }
    return false;
  }
}