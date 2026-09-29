import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CoursesDialog } from "./courses-dialog";
import { CoursesService } from "../services/courses.service";
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { MOCK_COURSES } from "../testing/testing-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { FieldState } from "@angular/forms/signals";
import { clickButton } from "../testing/testing-utils";



describe('Course Dialog', () => {

  let component: CoursesDialog;
  let fixture: ComponentFixture<CoursesDialog>;
  let de: DebugElement;
  let mockCoursesService: any;
  let mockDialogRef: any;


  beforeEach(async () => {

    mockCoursesService = {
      saveCourse: vi.fn().mockResolvedValue({}) /// just for returning  a promise
    }

    mockDialogRef = {
      close: vi.fn()
    }

    await TestBed.configureTestingModule({
      imports: [CoursesDialog],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: { course: MOCK_COURSES[0] } }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(CoursesDialog);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();

  });

  it('should initialze the form with course data', () => {

    expect(component.courseForm.description().value()).toBe("Beginner Course");
    expect(component.courseForm.category().value()).toBe("BEGINNER");
    expect(component.courseForm.releasedAt().value())
      .toBe(new Date().toLocaleDateString("en-CA"));
    expect(component.courseForm.longDescription().value()).toBe("Theory");
    expect(component.courseForm().valid()).toBe(true);

  })


  it('should handle form error', () => {
    testFieldError('.description', 'Description is required', component.courseForm.description())
    testFieldError('.category', 'Category is required', component.courseForm.category())
    testFieldError('.released-at', 'Release Date is required', component.courseForm.releasedAt())
    testFieldError('.long-description', 'Long Description is required', component.courseForm.longDescription())
  })

  it('should save course', async () => {
    component.courseForm.description().value.set("New Course Title");
    fixture.detectChanges();

    clickButton(de, ".btn-primary");
    await fixture.whenStable();

    // expect.objectContaining is used to expect when passing object and nested obect important******
    expect(mockCoursesService.saveCourse).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        titles: expect.objectContaining({
          description: "New Course Title"
        })
      })
    )

    expect(mockDialogRef.close).toHaveBeenCalled();

  })



  function testFieldError(cssClass: string, errorDescription: string, field: FieldState<string, string>) {
    field.value.set('');
    field.markAsTouched();
    fixture.detectChanges();

    const errorList = de.query(By.css(`${cssClass} .error-list`));
    expect(errorList).toBeTruthy;
    expect(errorList.nativeElement.textContent).toContain(errorDescription);

    const btn = de.query(By.css('.btn-primary')).nativeElement;
    expect(btn.disabled).toBe(true);
  }

})
