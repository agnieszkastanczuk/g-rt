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
  ValidationErrors,
  Validators,
  AbstractControl,
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

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const valid = hasNumber && hasUpper && hasLower && value.length > 7;
    return valid ? null : { passwordStrength: true };
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (!confirmPassword) {
      return null; // lub zwróć błąd, jeśli preferujesz wymuszenie wypełnienia
    }
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  activeTabIndex = 0;
  isReadyToSwap: boolean = true;

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
    console.log(this.activeTabIndex);
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isReadyToSwap = false;
      this.activeTabIndex = 0;
    }
  }

  get login() {
    return this.loginForm.get('login');
  }

  isDataValid: boolean = true;
  isLoggedIn: boolean = false;

  checkData() {
    const loginValue = this.loginForm.get('login')?.value;
    const passwordValue = this.loginForm.get('password')?.value;

    if (!loginValue || !passwordValue) {
      this.isDataValid = false;
      return;
    }

    //Sample data validation logic
    if (loginValue === 'testError') {
      this.isDataValid = false;
    } else {
      this.isDataValid = true;
      this.isLoggedIn = true;
    }
  }
}
