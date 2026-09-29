
import { calculator } from './calculator';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe("Vi test fundamental ", () => {
  // beforeEach(() => { // set in vitest-base config
  //   vi.clearAllMocks();
  //   vi.resetAllMocks();
  //   vi.restoreAllMocks();
  // })

  it("should add two number", () => {
    const result = calculator.add(3, 4);
    expect(result).toBe(7);
  })

  // spy actually make call the real function add in this block, it does not fake the function call
  it("shows how spies work", () => {
    const spy = vi.spyOn(calculator, "add");
    const result = calculator.add(3, 4);

    expect(result).toBe(7);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenLastCalledWith(3, 4);
  })

  it("show how mocking works", () => {
    const spy = vi.spyOn(calculator, "add").mockReturnValue(5); // this return value will over ride all calculator.add functions no matter how many times it has been called

    const result = calculator.add(2,3);
    expect(result).toBe(5);
    expect(spy).toHaveBeenCalledOnce();

    const result2 = calculator.add(5,5);
    expect(result2).toBe(5);

  })


  it("show how a pure mock works", () => {
    const addMock = vi.fn().mockReturnValue(10);
    const result = addMock(5, 5);
    expect(result).toBe(10)
    expect(addMock).toHaveBeenCalledOnce();
    expect(addMock).toHaveBeenLastCalledWith(5, 5);
  })

  it("show how mock clearing works", () => {
    const spy = vi.spyOn(calculator, "add")
    const result = calculator.add(3, 4);
    expect(result).toBe(7);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear(); // will clear the state of spy; below the toHaveBeenCalledOnce work as it clear the data from the above state
    const reult2 = calculator.add(5,5 );
    expect(reult2).toBe(10);
    expect(spy).toHaveBeenCalledOnce();

  })


  it("show how mockReset() works for spies", () => {
    const spy = vi.spyOn(calculator,"add");
    spy.mockReturnValue(10);

    const result = calculator.add(2,3)

    expect(result).toBe(10)
    expect(spy).toHaveBeenCalledOnce();

    spy.mockReset();

    const result1 = calculator.add(2,3)
    expect(result1).toBe(5)
    expect(spy).toHaveBeenCalledOnce();

  })


  it("show how mockReset() works for pure mocks", () => {
    const addMock = vi.fn().mockReturnValue(10);
    const result = addMock(5, 5);
    expect(result).toBe(10)
    expect(addMock).toHaveBeenCalledOnce();
    expect(addMock).toHaveBeenLastCalledWith(5, 5);
    addMock.mockReset();
    const result2 = addMock(5, 5);
    expect(addMock).toHaveBeenCalledOnce();
    expect(result2).toBe(undefined)
  })


   it("shows how mockRestore() work", () => {
    const spy = vi.spyOn(calculator, "add"); // spy has been disconnected when mockRestore is used
    spy.mockReturnValue(10)
    const result = calculator.add(3, 4);

    expect(result).toBe(10);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();

    const result2 = calculator.add(3, 4);
    expect(result2).toBe(7);
    expect(spy).toHaveBeenCalledTimes(0);

  })


})
