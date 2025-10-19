import { describe, it, expect } from "vitest";

describe("Scratch / Smoke Test", () => {
  it("druckt etwas in die Konsole", () => {
    let x = Math.hypot(10,10);
    console.log("testoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
    console.log(x);
    expect(true).toBe(true); // damit der Test 'grün' wird
  });
});
