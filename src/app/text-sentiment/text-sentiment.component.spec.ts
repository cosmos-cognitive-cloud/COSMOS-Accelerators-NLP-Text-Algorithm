import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSentimentComponent } from './text-sentiment.component';

describe('TextSentimentComponent', () => {
  let component: TextSentimentComponent;
  let fixture: ComponentFixture<TextSentimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSentimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSentimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
