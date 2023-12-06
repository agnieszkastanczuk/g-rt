import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

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
