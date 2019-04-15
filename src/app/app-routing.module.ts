import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Screen Route Imports
import { LandingScreenComponent } from './screens/landing/landing-screen.component';
import { LibraryComponent } from './screens/library/library.component';
import { LoginComponent } from './screens/login/login.component';

// Detail Views
import { MovieDetailComponent } from './details/movie/movie-detail.component';
import { SeriesDetailComponent } from './details/series/series-detail.component';
import { PhotosDetailComponent } from './details/photos/photos-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: LandingScreenComponent },
  { path: 'movies', component: LibraryComponent, pathMatch: 'full' },
  { path: 'movies/libraries/:id', component: LibraryComponent, pathMatch: 'full' },
  { path: 'movies/detail/:id', component: MovieDetailComponent, pathMatch: 'full'},
  { path: 'tvshows', component: LibraryComponent, pathMatch: 'full' },
  { path: 'tvshows/libraries/:id', component: LibraryComponent, pathMatch: 'full' },
  { path: 'tvshows/detail/:id', component: SeriesDetailComponent, pathMatch: 'full'},
  { path: 'tvshows/detail/:id/:season', component: SeriesDetailComponent, pathMatch: 'full'},
  { path: 'photos', component: LibraryComponent, pathMatch: 'full' },
  { path: 'photos/details/:id', component: PhotosDetailComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
