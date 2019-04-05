import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Screens
import { LandingScreenComponent } from './screens/landing/landing-screen.component';
import { MoviesScreenComponent } from './screens/movies/movies-screen.component';
import { LoginComponent } from './screens/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingScreenComponent,
    MoviesScreenComponent,
    LoginComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
