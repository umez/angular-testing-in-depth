import { ComponentRef, DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

export async function createTestFixture<T>(component: Type<T>) {
  await TestBed.configureTestingModule({
    imports: [component]
  }).compileComponents();

  const fixture = TestBed.createComponent(component);
  const componentRef = fixture.componentRef;
  const de = fixture.debugElement;
  const el = de.nativeElement;
  const componentInstance = fixture.componentInstance;

  return { fixture, componentRef, de, el, componentInstance };
}

export function clickButton(de: DebugElement, selector:string, log = false) {
  const btn = de.query(By.css(selector));
  if (log) {
    console.log(btn?.nativeElement?.innerHTML ?? `button with selector ${selector} not found`);
  }
  btn.nativeElement.click();
}

export function getTableContent(de:DebugElement, selector:string) {
  return de.queryAll(By.css(selector)).map(el => el?.nativeElement?.textContent ?? "not found");
}
