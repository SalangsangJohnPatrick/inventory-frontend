import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth-service.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  authForm: FormGroup;
  isLoginMode = true;
  error: string | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.formBuilder.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Set up dynamic validators based on mode
    this.updateValidators();
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null; // Clear error when switching modes
    this.updateValidators();
    this.authForm.reset(); // Reset form when switching modes
  }

  private updateValidators(): void {
    const nameControl = this.authForm.get('name');
    
    if (this.isLoginMode) {
      // Login mode: name is not required
      nameControl?.clearValidators();
    } else {
      // Signup mode: name is required
      nameControl?.setValidators([Validators.required, Validators.minLength(2)]);
    }
    
    nameControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { name, email, password } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.isLoading = false;
          this.error = err.error?.error || 'Login failed. Please check your credentials.';
        }
      });
    } else {
      this.authService.signup(name, email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.isLoading = false;
          this.error = err.error?.errors?.email || err.error?.message || 'Signup failed. Please try again.';
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.authForm.controls).forEach(key => {
      const control = this.authForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for template convenience
  get emailControl() {
    return this.authForm.get('email');
  }

  get passwordControl() {
    return this.authForm.get('password');
  }

  get nameControl() {
    return this.authForm.get('name');
  }

  // Helper method to check if form is valid
  get isFormValid(): boolean {
    return this.authForm.valid;
  }
}