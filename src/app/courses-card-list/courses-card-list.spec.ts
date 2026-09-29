import { COURSES } from './../../../server/db-data';
import { DebugElement } from '@angular/core';
import { CoursesCardList } from './courses-card-list';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { MOCK_COURSES } from '../testing/testing-data';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CoursesDialog } from '../courses-dialog/courses-dialog';

describe("Course card list", () => {

  let fixture: ComponentFixture<CoursesCardList>;
  let de: DebugElement;
  let component: CoursesCardList;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesCardList, CoursesDialog],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesCardList);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.componentRef.setInput('courses', MOCK_COURSES);
    fixture.detectChanges();
  })

  it("should display the list of course", () => {
    const cardTitles = de.queryAll(By.css('.course-card .card-header'));
    expect(cardTitles.length).toBe(2);

    const titleEl = cardTitles[0].nativeElement;
    expect(titleEl.textContent).toBe('Beginner Course')
  })

  it("should display message when no courses", () => {
    fixture.componentRef.setInput('courses', []);
    fixture.detectChanges();

    const message = de.query(By.css('.no-courses'));
    expect(message).toBeTruthy();
    expect(message.nativeElement.textContent).toContain("No courses found")
  })

  it("should display edit dialogue", () => {
    const btn = de.query(By.css('.course-card:first-child .edit-btn'));
    btn.nativeElement.click();
    fixture.detectChanges();

    const form = document.querySelectorAll(".course-form");
    expect(form, "The edit course form shuold be visible").toBeTruthy();

  })

})
