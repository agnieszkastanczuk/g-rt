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
    this.isReadyToSwap = !this.isReadyToSwap;
    this.activeTabIndex = this.activeTabIndex === 0 ? 1 : 0;
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

  checkData() {
    const loginValue = this.loginForm.get('login')?.value;
    const passwordValue = this.loginForm.get('password')?.value;
    this.isDataValid =
      loginValue !== 'testError' && passwordValue !== 'abcPassword';
    this.isLoggedIn = this.isDataValid;
  }

  get login() {
    return this.loginForm.get('login');
  }

  toggleResetPasswordForm() {
    this.showResetPasswordForm = !this.showResetPasswordForm;
  }
}
