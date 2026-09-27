import { HelloWorld } from "./hello-world";
import { describe, expect, it } from "vitest";
import { createTestFixture } from "../testing/testing-utils";

describe.skip("Hello world", async () => {

  const { fixture, de, el, componentInstance } = await createTestFixture(HelloWorld);

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeDefined()
  })

  it('should diplay the message', () => {

    const h1 = el.querySelector('h1');
    expect(h1).toBeDefined();
    expect(h1?.textContent).toEqual(componentInstance.message);

  })
})
