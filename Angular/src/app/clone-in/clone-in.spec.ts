import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneIn } from './clone-in';

describe('CloneIn', () => {
  let component: CloneIn;
  let fixture: ComponentFixture<CloneIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloneIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
