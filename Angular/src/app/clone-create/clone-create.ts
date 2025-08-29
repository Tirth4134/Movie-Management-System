import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NgIf } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { maxSelectedValidator } from '../validators/max-selected.validator';
interface GenreOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-clone-create',
  standalone: true,
  imports: [InputTextModule, FloatLabelModule, NgIf, ReactiveFormsModule, FormsModule, DatePicker, InputNumber, MultiSelectModule],
  templateUrl: './clone-create.html',
  styleUrls: ['./clone-create.css'],
  encapsulation: ViewEncapsulation.None 
})
export class CloneCreate implements OnInit {
  CreateForm!: FormGroup;
  submitting = false;
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
  ]

  // validation messages map
validationMessages: any = {
  title: {
    required: 'Title is required.',
    minlength: 'Title must be at least 4 characters long.',
    pattern: 'Only letters, numbers, spaces, - , : allowed.'
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
  image: {
    required: 'Image is required.'
  }
};

// stores error messages dynamically
formErrors: any = {
  title: '',
  genre: '',
  releasedYear: '',
  rating: '',
  description: '',
  image: ''
};

  constructor(
    private AuthService: Auth,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.CreateForm = this.fb.group({
      title: ['', Validators.required],
      genre: [[], [Validators.required,maxSelectedValidator(5)]],
      releasedYear: ['', Validators.min(1900)],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      description: ['', [Validators.required, Validators.maxLength(50)]],
      image: [null, Validators.required]
    });

    this.CreateForm.valueChanges.subscribe(() => {
    this.logValidationErrors();
  });
  }
  

  onYearSelect(date: Date) {
    const year = date.getFullYear();
    this.CreateForm.get('releasedYear')?.setValue(year);
    console.log(this.CreateForm.get('releasedYear')?.setValue(year));
  }

  onSubmit() {
    this.submitting = true
if (this.CreateForm.invalid) {
    this.logValidationErrors();  
    return;  
  }
    const payload = new FormData();
    payload.append('Title', this.CreateForm.get('title')?.value);

    const genres = this.CreateForm.get('genre')?.value && Array.isArray(this.CreateForm.get('genre')?.value)
      ? this.CreateForm.get('genre')?.value.join(',')
      : '';
    console.log(genres);

    payload.append('Genre', genres);

    const selectedDate: Date = this.CreateForm.get('releasedYear')?.value;
    const year = selectedDate ? selectedDate.getFullYear() : null;

    payload.append('ReleasedYear', year?.toString() ?? '');

    payload.append('Rating', this.CreateForm.get('rating')?.value);
    payload.append('Description', this.CreateForm.get('description')?.value);

    if (this.CreateForm.get('image')?.value) {
      payload.append('Image', this.CreateForm.get('image')?.value);
    }

  
    this.AuthService.add(payload).subscribe({
      next: (data) => {
        console.log('Movie added successfully:', data);
        console.log("releasedYear", this.CreateForm.get('releasedYear')?.value);

        this.submitting = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.submitting = true;
        console.error('Error adding movie:', err);
      }
    });
  }

  logValidationErrors(group: FormGroup = this.CreateForm): void {
  Object.keys(group.controls).forEach((key: string) => {
    const control = group.get(key);
    this.formErrors[key] = '';

    if (control && control?.invalid && (control?.touched || control?.dirty || this.submitting)) {
      const messages = this.validationMessages[key];
      for (const errorKey in control?.errors) {
        if (messages[errorKey]) {
          this.formErrors[key] = messages[errorKey];
        }
      }
    }
  });
}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.CreateForm.patchValue({ image: file });
    } else {
      this.CreateForm.patchValue({ image: null });
      event.target.value = '';
      alert('Only image files are allowed!');
    }
  }

  goBack() {
    this.ngOnInit()
    this.router.navigate(['/home']);
  }
  get title() {
    return this.CreateForm.get("title");
  }
  get genre() {
    return this.CreateForm.get("genre");
  }
  get rating() {
    return this.CreateForm.get("rating");
  }
  get releasedYear() {
    return this.CreateForm.get("releasedYear");
  }
  get description() {
    return this.CreateForm.get("description");
  }
  get image() {
    return this.CreateForm.get("image");
  }
}

























