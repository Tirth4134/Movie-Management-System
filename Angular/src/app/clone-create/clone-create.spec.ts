import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneCreate } from './clone-create';

describe('CloneCreate', () => {
  let component: CloneCreate;
  let fixture: ComponentFixture<CloneCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloneCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
