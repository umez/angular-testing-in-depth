import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { MOCK_TABS } from '../testing/testing-data';
import { TabData } from './tabs.model';
import { By } from '@angular/platform-browser';
import { TabsComponent } from './tabs';
import { createTestFixture } from '../testing/testing-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe.skip("Courses", async () => {

  let fixture: ComponentFixture<TabsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let component: TabsComponent;

  beforeEach(async () => {
    const mockTabs: TabData[] = MOCK_TABS;
    ({ fixture, de, el, componentInstance: component } = await createTestFixture(TabsComponent));
    fixture.componentRef.setInput('tabs', mockTabs);
    fixture.detectChanges();
  });

  it("should create the tabs component", () => {
    expect(component).toBeDefined()
  })

  it("should render the correct number of tab buttons", () => {
    const buttons = de.queryAll(By.css(".tab-link"));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent.trim()).toBe("Beginner");
    expect(buttons[1].nativeElement.textContent.trim()).toBe("Advanced");
  })

  /**
   * Input is passed using fixture.componentRef.setInput
   * detectchanges
   *  */
  it("should apply the active class to the selected tab", () => {
    fixture.componentRef.setInput('activeTab','advanced');
    fixture.detectChanges();
    const button = de.query(By.css('.tab-link:last-child'));
    expect(button.nativeElement.classList).toContain('active');
  })

  it("should emit activeTab when a tab is clicked", () => {
    const button = de.query(By.css('.tab-link:last-child'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('advanced');
  })

  it("should emit tabChanged when a tab is clicked", () => {
    const emitSpy = vi.spyOn(component.tabChanged, "emit");
    const button = de.query(By.css('.tab-link:last-child'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalledWith('advanced');
    expect(emitSpy).toHaveBeenCalledOnce()
  })
})
