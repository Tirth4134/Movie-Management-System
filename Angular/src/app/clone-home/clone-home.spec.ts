import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneHome } from './clone-home';

describe('CloneHome', () => {
  let component: CloneHome;
  let fixture: ComponentFixture<CloneHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloneHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
