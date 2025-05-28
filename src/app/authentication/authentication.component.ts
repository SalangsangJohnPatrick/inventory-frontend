import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth-service.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {

  authForm: FormGroup;
  isLoginMode = true;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.formBuilder.group({
      name: [''],
      email: [''],
      password: ['']
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    const {  name, email, password } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: err => this.error = err.error?.error || 'Login failed',
      });
    } else {
      this.authService.signup(name, email, password).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: err => this.error = err.error?.errors?.email || 'Signup failed',
      });
    }
  }

}
