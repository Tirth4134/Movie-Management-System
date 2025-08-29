

import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { FloatLabel } from 'primeng/floatlabel';
import { Auth } from '../auth';
import { Select } from 'primeng/select';
import Swal from 'sweetalert2';

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
  description?: string;
  releasedYear?: number;
  imageUrl?: string;
};

interface GenreOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-clone-home',
  standalone: true,
  imports: [RouterModule, FormsModule, Rating, FloatLabel, Select],
  templateUrl: './clone-home.html',
  styleUrl: './clone-home.css',
  encapsulation: ViewEncapsulation.None 

})
export class CloneHome implements OnInit {
  movieData: Movie[] = [];
  filteredMovies: Movie[] = [];
  value: number = 0.1
  SearchInput = '';

  selectedGenre: string | null = '';
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

  constructor(
    private Authservice: Auth,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.Authservice.getData().subscribe((data: any[]) => {
      this.movieData = data ?? [];
      this.filteredMovies = [...this.movieData];


      const allGenres: string[] = [];
      this.movieData.forEach(m => {
        if (m.genre) {
          m.genre.split(',')
            .map((g: string) => g.trim())
            .forEach((g: string) => allGenres.push(g));
        }
      });


      this.ref.detectChanges();
    });

  }

  applyFilters() {
    let data = [...this.movieData];

    if (this.SearchInput) {
      data = data.filter(m =>
        m.title?.toLowerCase().includes(this.SearchInput.toLowerCase())
      );
    }

    if (this.selectedGenre) {
      data = data.filter(m =>
        (m.genre ?? '').toLowerCase().includes(this.selectedGenre?.toLowerCase() ?? '')
      );
    }

    this.filteredMovies = data;
  }

  deleteBtn(movieId: number): void {
    Swal.fire({
      title: "Are you sure you want to delete moive?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {

      if (result.isConfirmed) {
        this.Authservice.delete(movieId).subscribe({
          next: () => this.ngOnInit(),
          error: (error) => console.error('Error deleting movie:', error)
        });
      } else if (result.isDenied) {

      }
    });
  }

  addBtn() {
    this.router.navigate(['/add']);
  }
  logout() {
    this.Authservice.logout();
    this.router.navigate(['/login']);

  }
}
