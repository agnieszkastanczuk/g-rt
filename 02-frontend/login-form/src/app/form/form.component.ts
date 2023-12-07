import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  loginForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [this.passwordValidator]),
      confirmPassword: new FormControl(''),
    },
    { validators: this.matchPasswords }
  );

  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  activeTabIndex = 0;
  isReadyToSwap: boolean = true;
  isResetEmailSent: boolean = false;
  isDataValid: boolean = true;
  isLoggedIn: boolean = false;
  showResetPasswordForm: boolean = false;

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    return hasNumber && hasUpper && hasLower && value.length > 7
      ? null
      : { passwordStrength: true };
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  swapIndex() {
    if (this.isReadyToSwap) {
      if (this.activeTabIndex === 0) {
        this.activeTabIndex = 1;
      } else {
        this.activeTabIndex = 0;
      }
    } else {
      this.isReadyToSwap = true;
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isReadyToSwap = false;
      this.activeTabIndex = 0;
    }
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      console.log(
        'Instrukcje resetowania hasła wysłane na: ',
        this.resetPasswordForm.get('email')?.value
      );
      this.isResetEmailSent = true;
    }
  }

  constructor(private authService: AuthService) {}

  checkData() {
    const emailValue = this.loginForm.get('login')?.value || '';
    const passwordValue = this.loginForm.get('password')?.value || '';

    if (emailValue && passwordValue) {
      this.authService.login(emailValue, passwordValue).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.isLoggedIn = true;
        },
        error: (error) => {
          console.log('Login failed', error);
          this.isDataValid = false;
          this.isLoggedIn = false;
        },
      });
    } else {
      console.log('Email and/or password cannot be empty');
    }
  }

  get login() {
    return this.loginForm.get('login');
  }

  toggleResetPasswordForm() {
    this.showResetPasswordForm = !this.showResetPasswordForm;
  }
}
