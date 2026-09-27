import { CoursePage } from './course-page';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, Snapshots, vi } from "vitest";
import { CoursesService } from '../services/courses.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getMockLessonsPage, MOCK_COURSES } from '../testing/testing-data';
import { DebugElement } from '@angular/core';
import { clickButton, getTableContent } from '../testing/testing-utils';
import { By } from '@angular/platform-browser';

const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0, 3);
const SECOND_PAGE = getMockLessonsPage(2, '', 'asc', 0, 3);
const SEARCH_RESULTS = getMockLessonsPage(1, 'Lesson 20', 'asc', 0, 3);

describe('Course page', () => {

  let component: CoursePage;
  let fixture: ComponentFixture<CoursePage>;
  let de: DebugElement;
  let mockCoursesService: any;

  beforeEach(async () => {

    mockCoursesService = {
      findLessons: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                course: MOCK_COURSES[0]
              }
            }
          }
        },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePage);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it("should load lessons on init", async () => {
    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);
    await fixture.whenStable();

    expect(mockCoursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 0, 3);

    const lessons = getTableContent(de, "tbody tr td.description-cell");

    expect(lessons).toHaveLength(3);
    expect(lessons[0]).toBe("Lesson 1");
    expect(lessons[1]).toBe("Lesson 2");
    expect(lessons[2]).toBe("Lesson 3");
  })

  it('should show the loading spinner while fetching', async() => {
    fixture.detectChanges(); // will trigger ng on init
    const spinner = de.query(By.css(".loading-spinner"));
    expect(spinner).toBeTruthy();
    expect(component.loading()).toBe(true);
  })

  it('should navigate to the next page', async () => {

    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);

    await fixture.whenStable();

    expect(mockCoursesService.findLessons).toHaveBeenCalledOnce();
    expect(mockCoursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 0, 3);

    mockCoursesService.findLessons.mockReturnValueOnce(SECOND_PAGE);

    clickButton(de, '.page-controls button:last-child');

    await fixture.whenStable();


    const lessons = getTableContent(de, "tbody tr td.description-cell");
    console.log(lessons)
    expect(lessons).toHaveLength(3);
    // expect(lessons[0]).toBe("Lesson 4");
    // expect(lessons[1]).toBe("Lesson 5");
    // expect(lessons[2]).toBe("Lesson 6");

  })

})
