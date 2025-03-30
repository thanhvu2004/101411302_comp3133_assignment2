import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // Mark as standalone
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http
        .post('http://localhost:5000/graphql', {
          query: `
            query {
              login(usernameOrEmail: "${this.loginForm.value.usernameOrEmail}", password: "${this.loginForm.value.password}")
            }
          `,
        })
        .subscribe(
          (response: any) => {
            const token = response.data.login;
            localStorage.setItem('token', token);
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            this.errorMessage = 'Invalid username/email or password.';
          }
        );
    }
  }
}