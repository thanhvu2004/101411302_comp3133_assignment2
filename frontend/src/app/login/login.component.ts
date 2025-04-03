import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      const { usernameOrEmail, password } = this.loginForm.value;
      this.userService.login(usernameOrEmail, password).subscribe(
        (response: any) => {
          const token = response.data.login;
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.isSubmitting = false; // Re-enable the button if there's an error
          this.errorMessage = 'Invalid username/email or password.';
        }
      );
    }
  }
}