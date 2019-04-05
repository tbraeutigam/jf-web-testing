import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesScreenComponent } from './movies-screen.component';

describe('MoviesScreenComponent', () => {
  let component: MoviesScreenComponent;
  let fixture: ComponentFixture<MoviesScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoviesScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
