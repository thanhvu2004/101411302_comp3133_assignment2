import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:5000/graphql';

  constructor(private readonly http: HttpClient) {}

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
}