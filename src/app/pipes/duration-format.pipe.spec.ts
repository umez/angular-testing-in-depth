
import { beforeEach, describe, expect, it } from "vitest";
import { DurationFormatPipe } from "./duration-format.pipe";

describe('Duration format pipe', () => {

  let pipe: DurationFormatPipe;

  beforeEach(() => {
    pipe = new DurationFormatPipe()
  })

  it('should be truthy', () => {
    expect(pipe).toBeTruthy();
  })

  it('should format duration', () => {
    const result = pipe.transform("05:30");
    expect(result).toBe("05h 30m");
  })


  it('should handle null or undefined', () => {
    expect(pipe.transform(<any> null)).toBe('');
    expect(pipe.transform(<any> undefined)).toBe('');
  })

  it('should return the original value if inavlid input', () => {

   const result = pipe.transform("55.80");
    expect(result).toBe("55.80");

  })

  it('should only format the first two parts', () => {
    const result = pipe.transform("01:20:36");
    expect(result).toBe("01h 20m");
  })



})
