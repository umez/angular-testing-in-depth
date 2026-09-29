import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CoursesService } from "./courses.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { HttpParams, provideHttpClient } from "@angular/common/http";
import { createCourse, MOCK_COURSES } from "../testing/testing-data";

let service: CoursesService;
let httpTestingController: HttpTestingController;


describe('Course service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })

    service = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  })

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should call all courses', async () => {

    const coursesPromise =  service.reloadAllCourses(); // promise returns

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toBe('GET');
    req.flush({payload: MOCK_COURSES}); // flush with mock courses

    const result = await coursesPromise; // grab the promise from above;

    expect(result).toBe(MOCK_COURSES);
    expect(service.allCourses()).toBe(MOCK_COURSES);
  })

  it('should get course by Id', async () => {

    const coursePromise = service.findCourseById(1);

    const req = httpTestingController.expectOne("/api/courses/1");
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_COURSES[0]);

    const course = await coursePromise;

    expect(course.id).toBe(1);
    expect(course.titles.description).toBe('Beginner Course');
  })

  it('should find lesson based on parameter', async () => {
    const lessonPromise = service.findLessons(12, 'filter-text', 'desc', 2, 10);

    const req = httpTestingController.expectOne(req => req.url === "/api/lessons");
    const params =  req.request.params;

    expect(params.get('courseId')).toBe('12');
    expect(params.get('filter')).toBe('filter-text');
    expect(params.get('sortOrder')).toBe('desc');
    expect(params.get('pageNumber')).toBe('2');
    expect(params.get('pageSize')).toBe('10');

    const mockLessons = {payload: [{id: 12, description: "Lesson 1"}]} /// mock lesson for passing in flush

    req.flush(mockLessons);

    const result = await lessonPromise;

    expect(result).toBe(mockLessons.payload);

  })

  it('should save course', async () => {

    //** load 2 mock couses by flushing following course 1 and 2
    // call reload all courses so the the 2 couses remain in memory
    // so that save course can be triggered to the already loaded courses */

    const course1 = createCourse({id: 1, titles: {description: 'Initial Title'}})
    const course2 = createCourse({id: 2, titles: {description: 'Stay Same'}})

    const loadPromise = service.reloadAllCourses();

    const loadReq = httpTestingController.expectOne('/api/courses');

    loadReq.flush({payload: [course1, course2]});

    await loadPromise;



    const changes = {titles : {
      description: 'New Initial Title'
    }}

    const savePromise = service.saveCourse(1, changes);

    const saveReq = httpTestingController.expectOne('/api/courses/1');
    expect(saveReq.request.method).toBe('PUT');
    expect(saveReq.request.body).toBe(changes);

    saveReq.flush({...course1, ...changes})

    await savePromise;

    const allCourses = service.allCourses(); // make all courses api after changes are made

    expect(allCourses[0].titles.description).toBe('New Initial Title');
    expect(allCourses[1].id).toBe(2);
    expect(allCourses[1].titles.description).toBe('Stay Same');



  })


})



// basic code structure of http service test

// import { afterEach, beforeEach, describe } from "vitest";
// import { CoursesService } from "./courses.service";
// import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
// import { TestBed } from "@angular/core/testing";
// import { provideHttpClient } from "@angular/common/http";

// let service: CoursesService;
// let httpTestingController: HttpTestingController;


// describe('Course service', () => {

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers:[
//         CoursesService,
//         provideHttpClient(),
//         provideHttpClientTesting(),
//       ]
//     })

//     service = TestBed.inject(CoursesService);
//     httpTestingController = TestBed.inject(HttpTestingController);
//   })

//   afterEach(() => {
//     httpTestingController.verify();
//   })


// })

