import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-clone-in',
  imports: [RouterModule, FormsModule ,FloatLabel, InputTextModule, PasswordModule],

  templateUrl: './clone-in.html',
  styleUrl: './clone-in.css'
})
export class CloneIn {
  Emailid: string = '';
  Password: string = '';
 

  
  constructor(private http: HttpClient, private router: Router) {}

  register() {
    

    const registerData =  {
      Emailid:  this.Emailid,
      Password: this.Password
    };

    this.http.post('https://localhost:7210/api/Auth/register', registerData)
      .subscribe({
        next: () => {
         
          Swal.fire({
              icon: "success",
              width: 250,
              text: "Registration successful!"
          });

          this.router.navigate(['/login']); 
        },
        error: (err) => {
          console.error('Registration failed:', err);
           Swal.fire({
                icon: "error",
                width: 250,
              text: err.error || 'Registration failed. Please try again.'
          });
        }
      });
      
  }
    
}
