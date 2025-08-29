
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../auth';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { maxSelectedValidator } from '../validators/max-selected.validator';

interface Movie {
  id: number;
  title: string;
  genre: string;
  releasedYear?: number;
  // year?: number;
  rating?: number;
  description?: string;
  image?: string; 
  imageUrl?: string;
}

interface GenreOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-clone-edit',
  standalone: true,
  imports: [InputTextModule, FloatLabelModule, NgIf ,CommonModule, ReactiveFormsModule,FormsModule, DatePicker, InputNumber, MultiSelectModule],
  templateUrl: './clone-edit.html',
  styleUrls: ['./clone-edit.css'],
    encapsulation: ViewEncapsulation.None 

})
export class CloneEdit implements OnInit {
  editForm: FormGroup;
  movieId: number = 0;
  currentImage?: string; 
  submitting: boolean = false;
      maxDate = new Date(2025, 11, 31);


  genres: GenreOption[] = [
    { label: 'Action', value: 'Action' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Sci-Fi', value: 'Sci-Fi' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Fantasy', value: 'Fantasy' }
  ];

   validationMessages : any ={
    title: {
       required: 'Title is required.',
       minlength: 'Title must be at least 4 characters long.',
       pattern: 'Only letters, numbers, spaces, -, . , : allowed.'
      
    },
    genre: {
    required: 'Genre is required.',
    maxSelected: 'You can select maximum 5 genres only.'
  },
  releasedYear: {
    required: 'Released year is required.'
  },
  rating: {
    required: 'Rating is required.',
    pattern: 'Only numbers allowed, no signs (-, +, etc).',
    min: 'Rating must be greater than 0.',
    max: 'Rating cannot exceed 10.'
  },
  description: {
    required: 'Description is required.',
    maxlength: 'Only 250 characters allowed.'
  },
   }

   formErrors :any =  {
      title : '',
      genre : '',
      releasedYear : '',
      rating : '',
      description : ''
      
   }

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      genre: [[], maxSelectedValidator(5)],
      year: [''],
      rating: [''],
      description: [''],
      image: [''] 
    });
  }

  ngOnInit() {
  
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));

    this.authService.getMovieById(this.movieId).subscribe({
      next: (movie: Movie[]) => {
        console.log('Movie fetched:', movie); 
        
        if (Array.isArray(movie) && movie.length > 0) {
          const m = movie[0];

        const genres = m.genre ? m.genre.split(',').map(g => g.trim()) : [];

          this.currentImage =  m.imageUrl; 
          console.log('Current image set to:', this.currentImage);

          const currentYear = m.releasedYear
          console.log(currentYear);
          const rating = m.rating
          console.log("patch rating :",m.rating)
          
          this.editForm.patchValue({
            title: m.title || '',
            genre: genres,
            year:  currentYear ? new Date(currentYear, 0, 1) : null,
            rating: m.rating,
            description: m.description || '',
            image: this.currentImage || m.imageUrl 
          });
          console.log('Form after patch:', this.editForm.value); 
        }
      },
      error: (err) => console.error('Error loading movie:', err)
    });
       this.editForm.valueChanges.subscribe(() => {
    this.loginValidationErrors();
  });
  }

  onSubmit() {
    
      this.submitting = true;
   
      if(this.editForm.invalid){
         this.loginValidationErrors();
         return;
      }
      const formValue = this.editForm.value;
      const payload = new FormData();
      payload.append('title', formValue.title || '');

 const genres = formValue.genre && Array.isArray(formValue.genre) 
        ? formValue.genre.join(',') 
        : '';
        console.log(genres);
        
      payload.append('Genre', genres);

     
//  payload.append('genre', formValue.genre || '');

     const selectedDate: Date = formValue.year;
     const year = selectedDate ? selectedDate.getFullYear() : null;

     payload.append('releasedYear', year?.toString() ?? '');
    
      payload.append('rating', formValue.rating || '');
      payload.append('description', formValue.description || '');
      console.log( formValue.year);
      
      if (formValue.image instanceof File) {
        payload.append('image', formValue.image);
              console.log( formValue.image);

      } else if (formValue.image) {
        
        console.log(this.currentImage);
        if(this.currentImage){
      //  const fileName = this.currentImage.split('/').pop(); 
        payload.append('image',this.currentImage); 
       }
      } else {
        alert('No image available. Please upload an image.');
        this.submitting = false;
        return;
      }



      payload.forEach((value, key) => {
        console.log(`FormData: ${key} = ${value}`);
      });

      this.authService.edit(this.movieId, payload).subscribe({
        next: (data) => {
          console.log('Movie updated successfully:', data);
          this.submitting = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Update error:', err);
          alert(`Update failed: ${err.message || 'Unknown error'}`);
        }
      });
    
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editForm.patchValue({ image: file });
      this.editForm.get('image')?.markAsTouched();
    } 
    else {
      if (this.currentImage) {
        this.editForm.patchValue({ image: this.currentImage });
        this.editForm.get('image')?.markAsUntouched(); // Reset touched state
        this.editForm.get('image')?.updateValueAndValidity(); // Update validity
      }
    }
  }

  loginValidationErrors(group: FormGroup = this.editForm){
      Object.keys(group.controls).forEach((key: string) => {
        const control = group.get(key);
        this.formErrors[key] = '';
    if( control && control.invalid && (control.dirty || control.touched || this.submitting)){
        const messages =  this.validationMessages[key];
          for( const errorkey in control.errors ){
              if(messages[errorkey]){
                  this.formErrors[key] = messages[errorkey];
              }
         } }
      })
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  get title(){
     return this.editForm.get("title");
  }

  get genre(){
     return this.editForm.get("genre");
  }
  get year(){
     return this.editForm.get("year");
  }
  get rating(){
     return this.editForm.get("rating");
  }
  get description(){
     return this.editForm.get("description");
  }
}
