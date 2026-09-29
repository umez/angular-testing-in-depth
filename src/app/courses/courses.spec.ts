import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input, model, output, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Courses } from './courses';
import { CoursesService } from '../services/courses.service';
import { CoursesCardList } from '../courses-card-list/courses-card-list';
import { TabsComponent } from '../tabs/tabs';
import { CourseCategory } from '../model/course';

// ---------- Stubs ----------
@Component({ selector: 'courses-card-list', template: '' })
class CoursesCardListStub {
  courses = input<any[]>([]);
  courseEdited = output<void>();
}

@Component({ selector: 'tabs', template: '' })
class TabsStub {
  tabs = input<any[]>([]);
  activeTab = model<string>();
  tabChanged = output<string>();
}

// ---------- Test data ----------
const beginnerCourse = { id: 1, title: 'Intro to Angular', category: 'BEGINNER' };
const advancedCourse = { id: 2, title: 'Signals Deep Dive', category: 'ADVANCED' };

// ---------- Shared setup ----------
const allCourses = signal<any[]>([]);
const serviceMock = {
  allCourses,
  reloadAllCourses: vi.fn(),
};

async function configureTestBed() {
  await TestBed.configureTestingModule({
    imports: [Courses],
    providers: [{ provide: CoursesService, useValue: serviceMock }],
  })
    .overrideComponent(Courses, {
      remove: { imports: [CoursesCardList, TabsComponent] },
      add: { imports: [CoursesCardListStub, TabsStub] },
    })
    .compileComponents();
}

/** Creates the component, seeds the service data and tab, then renders. */
function render(opts: { courses?: any[]; tab?: CourseCategory } = {}) {
  allCourses.set(opts.courses ?? []);

  const fixture = TestBed.createComponent(Courses);
  const component = fixture.componentInstance;
  if (opts.tab) component.activeTab.set(opts.tab);
  fixture.detectChanges();

  return { fixture, component };
}

// ---------- Shared queries ----------
const getLists = (f: ComponentFixture<Courses>) =>
  f.debugElement.queryAll(By.directive(CoursesCardListStub));

const getTabs = (f: ComponentFixture<Courses>) =>
  f.debugElement.query(By.directive(TabsStub)).componentInstance as TabsStub;

const getEmptyMsg = (f: ComponentFixture<Courses>) =>
  f.nativeElement.querySelector('.empty-msg') as HTMLElement | null;

// ---------- Tests ----------
describe('Courses', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await configureTestBed();
  });

  // initialisation
  it('defaults to the beginner tab', () => {
    const { component } = render();
    expect(component.activeTab()).toBe('beginner');
  });

  it('exposes the beginner and advanced tabs', () => {
    const { component } = render();
    expect(component.courseTabs).toEqual([
      { label: 'Beginner', value: 'beginner' },
      { label: 'Advanced', value: 'advanced' },
    ]);
  });

  it('reloads courses once on init', () => {
    render();
    expect(serviceMock.reloadAllCourses).toHaveBeenCalledTimes(1);
  });

  // computed lists
  it('splits allCourses into beginner and advanced lists', () => {
    const { component } = render({ courses: [beginnerCourse, advancedCourse] });

    expect(component.beginnerCourses()).toEqual([beginnerCourse]);
    expect(component.advancedCourses()).toEqual([advancedCourse]);
  });

  it('updates computed lists when the service signal changes', () => {
    const { component } = render();
    expect(component.beginnerCourses()).toEqual([]);

    allCourses.set([beginnerCourse]);

    expect(component.beginnerCourses()).toEqual([beginnerCourse]);
  });

  // methods
  it('reloadCourses() delegates to the service', async () => {
    const { component } = render();
    serviceMock.reloadAllCourses.mockClear();

    await component.reloadCourses();

    expect(serviceMock.reloadAllCourses).toHaveBeenCalledTimes(1);
  });

  it('onTabChanged() updates the active tab', () => {
    const { component } = render();

    component.onTabChanged('advanced');

    expect(component.activeTab()).toBe('advanced');
  });

  // template: beginner tab
  it('beginner tab: renders the card list with beginner courses only', () => {
    const f = render({ courses: [beginnerCourse, advancedCourse] }).fixture;

    expect(getLists(f).length).toBe(1);
    expect(getLists(f)[0].componentInstance.courses()).toEqual([beginnerCourse]);
    expect(getEmptyMsg(f)).toBeNull();
  });

  it('beginner tab: shows the empty message when there are no courses', () => {
    const f = render({ courses: [advancedCourse] }).fixture;

    expect(getLists(f).length).toBe(0);
    expect(getEmptyMsg(f)?.textContent).toContain('No beginner courses available.');
  });

  // template: advanced tab
  it('advanced tab: renders the card list with advanced courses only', () => {
    const f = render({ courses: [beginnerCourse, advancedCourse], tab: 'advanced' }).fixture;

    expect(getLists(f).length).toBe(1);
    expect(getLists(f)[0].componentInstance.courses()).toEqual([advancedCourse]);
  });

  it('advanced tab: shows the empty message when there are no courses', () => {
    const f = render({ courses: [beginnerCourse], tab: 'advanced' }).fixture;

    expect(getLists(f).length).toBe(0);
    expect(getEmptyMsg(f)?.textContent).toContain('No advanced courses available.');
  });

  // template: child wiring
  it('passes the tabs config and active tab to <tabs>', () => {
    const { fixture, component } = render();
    const tabs = getTabs(fixture);

    expect(tabs.tabs()).toEqual(component.courseTabs);
    expect(tabs.activeTab()).toBe('beginner');
  });

  it('calls onTabChanged when <tabs> emits tabChanged', () => {
    const { fixture, component } = render();
    const spy = vi.spyOn(component, 'onTabChanged');

    getTabs(fixture).tabChanged.emit('advanced');

    expect(spy).toHaveBeenCalledWith('advanced');
    expect(component.activeTab()).toBe('advanced');
  });

  it('updates the parent signal through the two-way binding', () => {
    const { fixture, component } = render();

    getTabs(fixture).activeTab.set('advanced');

    expect(component.activeTab()).toBe('advanced');
  });

  it('switches the rendered list when the tab changes', () => {
    const { fixture, component } = render({ courses: [beginnerCourse, advancedCourse] });
    expect(getLists(fixture)[0].componentInstance.courses()).toEqual([beginnerCourse]);

    component.onTabChanged('advanced');
    fixture.detectChanges();

    expect(getLists(fixture).length).toBe(1);
    expect(getLists(fixture)[0].componentInstance.courses()).toEqual([advancedCourse]);
  });

  it('reloads courses when the card list emits courseEdited', () => {
    const { fixture } = render({ courses: [beginnerCourse] });
    serviceMock.reloadAllCourses.mockClear(); // ignore the ngOnInit call

    getLists(fixture)[0].componentInstance.courseEdited.emit();

    expect(serviceMock.reloadAllCourses).toHaveBeenCalledTimes(1);
  });

    // ---------- template: rendered HTML ----------
  it('html: renders the container, tabs and main.tab-content', () => {
    const { fixture } = render();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('div.container')).not.toBeNull();
    expect(el.querySelector('div.container > tabs')).not.toBeNull();
    expect(el.querySelector('div.container > main.tab-content')).not.toBeNull();
  });

  it('html: renders exactly one <courses-card-list> inside main for the beginner tab', () => {
    const { fixture } = render({ courses: [beginnerCourse, advancedCourse] });
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('main.tab-content courses-card-list').length).toBe(1);
    expect(el.querySelector('p.empty-msg')).toBeNull();
  });

  it('html: renders a <p class="empty-msg"> with the exact beginner text and no list', () => {
    const { fixture } = render({ courses: [advancedCourse] });
    const el: HTMLElement = fixture.nativeElement;

    const msg = el.querySelector('main.tab-content > p.empty-msg');
    expect(msg).not.toBeNull();
    expect(msg!.textContent?.trim()).toBe('No beginner courses available.');
    expect(el.querySelector('courses-card-list')).toBeNull();
  });

  it('html: renders the advanced empty message with the exact text', () => {
    const { fixture } = render({ courses: [beginnerCourse], tab: 'advanced' });
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('p.empty-msg')?.textContent?.trim())
      .toBe('No advanced courses available.');
    expect(el.querySelector('courses-card-list')).toBeNull();
  });

  it('html: never renders both tab sections at once', () => {
    const { fixture, component } = render({ courses: [beginnerCourse, advancedCourse] });
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('courses-card-list').length).toBe(1);

    component.onTabChanged('advanced');
    fixture.detectChanges();

    expect(el.querySelectorAll('courses-card-list').length).toBe(1);
  });

  it('html: swaps the empty message to the list when courses arrive', () => {
    const { fixture } = render();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('p.empty-msg')).not.toBeNull();

    allCourses.set([beginnerCourse]);
    fixture.detectChanges();

    expect(el.querySelector('p.empty-msg')).toBeNull();
    expect(el.querySelector('courses-card-list')).not.toBeNull();
  });
});
