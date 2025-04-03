import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isSubmitting = true;
      this.userService.signup(this.signupForm.value).subscribe(
        (response: any) => {
          this.successMessage = 'Signup successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        (error) => {
          this.errorMessage = 'Signup failed. Please try again.';
          this.isSubmitting = false; // Re-enable the button if there's an error
        }
      );
    }
  }
}