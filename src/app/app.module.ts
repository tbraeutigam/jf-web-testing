import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Screens
import { LandingScreenComponent } from './screens/landing/landing-screen.component';
import { LibraryComponent } from './screens/library/library.component';
import { LoginComponent } from './screens/login/login.component';

// Detail Views
import { MovieDetailComponent } from './details/movie/movie-detail.component';
import { SeriesDetailComponent } from './details/series/series-detail.component';
import { PhotosDetailComponent } from './details/photos/photos-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingScreenComponent,
    LibraryComponent,
    LoginComponent,
    MovieDetailComponent,
    SeriesDetailComponent,
    PhotosDetailComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
