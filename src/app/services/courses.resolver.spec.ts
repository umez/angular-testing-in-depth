import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot } from "@angular/router";
import { CoursesService } from "./courses.service";
import { courseResolver } from "./course.resolver";
import { createCourse, MOCK_COURSES, MOCK_LESSONS } from "../testing/testing-data";
import { CoursePage } from "../course-page/course-page";


describe('CourseResolver', () => {

  let mockCoursesService: any;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    mockCoursesService = {
      findCourseById: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [{
        provide: CoursesService, useValue: mockCoursesService },
        provideRouter([{
          path: 'courses/:id',
          component: CoursePage,
          resolve: {
            course: courseResolver
          }
        }])
      ]
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  it("should load correct course by Id", async () => {

    mockCoursesService.findCourseById.mockResolvedValueOnce(MOCK_COURSES[0]);

    const component = await harness.navigateByUrl('/courses/1', CoursePage); /// component is from <router-outlet /> present in app after <toolbar/>

    expect(TestBed.inject(Router).url).toBe('/courses/1');

    expect(mockCoursesService.findCourseById).toHaveBeenCalledOnce();
    expect(mockCoursesService.findCourseById).toHaveBeenLastCalledWith('1');

    expect(component.course()).toEqual(MOCK_COURSES[0]);

    expect(harness.routeNativeElement?.textContent).toContain('Beginner Course')


  })

})
