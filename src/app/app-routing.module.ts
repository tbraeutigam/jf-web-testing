import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Screen Route Imports
import { LandingScreenComponent } from './screens/landing/landing-screen.component';
import { MoviesScreenComponent }  from './screens/movies/movies-screen.component';
import { TvshowsComponent }  from './screens/tvshows/tvshows.component';
import { LibraryComponent } from './screens/library/library.component';
import { LoginComponent } from './screens/login/login.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: LandingScreenComponent },
  { path: 'movies', component: LibraryComponent, pathMatch: 'full' },
  { path: 'movies/libraries/:id', component: LibraryComponent },
  { path: 'tvshows', component: LibraryComponent, pathMatch: 'full' },
  { path: 'tvshows/libraries/:id', component: LibraryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
