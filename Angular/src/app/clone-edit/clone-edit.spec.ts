import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneEdit } from './clone-edit';

describe('CloneEdit', () => {
  let component: CloneEdit;
  let fixture: ComponentFixture<CloneEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloneEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
