import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'desktop-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  onSubmit(): void {
    const { email, password, firstName, lastName } = this.loginForm.value;
    if (!email || !password || !firstName || !lastName) return;
    this.authService.register({ email, password, firstName, lastName });
  }
}
