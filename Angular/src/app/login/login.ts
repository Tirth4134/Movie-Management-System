
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, EmailValidator } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../auth';
import { NgIf } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Password, PasswordModule } from 'primeng/password';
import { error } from 'node:console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf, FloatLabel, InputTextModule, PasswordModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm!: FormGroup;
  loginError: boolean = false; 
  errorMessage : string = ''
  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
      private cdr: ChangeDetectorRef

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get Data() {
    return this.loginForm.controls;
  }

  

  login() {
  this.loginError = false; 
    this.errorMessage = '';

  if (this.loginForm.invalid ) {
    this.loginError = true;
    this.errorMessage = 'Invalid email or password';
    this.loginForm.markAllAsTouched();
    return;
  }

  const loginData = {
    Emailid: this.Data['email'].value,
    Password: this.Data['password'].value
  };

  this.authService.login(loginData).subscribe({
    next: (res) => { 
      this.loginError = false
      localStorage.setItem('token', res.token);
      this.router.navigate(['/home']);
    },
    error: (err) => {
   
  this.loginError = true;
  this.errorMessage = typeof err.error === 'string' ? err.error : 'Invalid email or password';
  this.cdr.detectChanges(); 
}
          
  });
}

  home(){
    this.router.navigate(['/home'])
  }
}
