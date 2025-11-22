import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";
import { DEFAULT_DELIMITER } from "../../../src/adap-b03/common/Printable";

// ---------------------------------------------------------
// Basic StringName tests
// ---------------------------------------------------------

describe("Basic StringName function tests", () => {
  it("insert in middle", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("append at end", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("remove at index 0", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });

  it("getComponent and setComponent", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.getComponent(1)).toBe("cs");
    n.setComponent(1, "dpt");
    expect(n.asString()).toBe("oss.dpt.fau.de");
  });

  it("isEmpty for empty and non-empty names", () => {
    let n1: Name = new StringName("");
    let n2: Name = new StringName("oss");
    expect(n1.isEmpty()).toBe(true);
    expect(n2.isEmpty()).toBe(false);
  });

  it("default delimiter character is '.'", () => {
    let n: Name = new StringName("oss.cs");
    expect(n.getDelimiterCharacter()).toBe(DEFAULT_DELIMITER);
  });
});

// ---------------------------------------------------------
// Basic StringArrayName tests
// ---------------------------------------------------------

describe("Basic StringArrayName function tests", () => {
  it("insert in middle", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("append at end", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("remove at index 0", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });

  it("getComponent and setComponent", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getComponent(2)).toBe("fau");
    n.setComponent(2, "dpt");
    expect(n.asString()).toBe("oss.cs.dpt.de");
  });

  it("isEmpty for [] and ['']", () => {
    let n1: Name = new StringArrayName([]);
    let n2: Name = new StringArrayName([""]);
    let n3: Name = new StringArrayName(["oss"]);
    expect(n1.isEmpty()).toBe(true);
    expect(n2.isEmpty()).toBe(true);
    expect(n3.isEmpty()).toBe(false);
  });

  it("default delimiter character is '.'", () => {
    let n: Name = new StringArrayName(["oss", "cs"]);
    expect(n.getDelimiterCharacter()).toBe(DEFAULT_DELIMITER);
  });
});

// ---------------------------------------------------------
// Delimiter tests (custom delimiter '#')
// ---------------------------------------------------------

describe("Delimiter function tests", () => {
  it("StringName with custom delimiter '#'", () => {
    let n: Name = new StringName("oss#fau#de", "#");
    n.insert(1, "cs");
    expect(n.getDelimiterCharacter()).toBe("#");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });

  it("StringArrayName with custom delimiter '#'", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"], "#");
    n.insert(1, "cs");
    expect(n.getDelimiterCharacter()).toBe("#");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

// ---------------------------------------------------------
// Clone, equality, hashCode
// ---------------------------------------------------------

describe("Clone, equality and hashCode tests", () => {
  it("StringName clone produces equal but independent copy", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2 = n1.clone() as Name;

    // andere Referenz
    expect(n2).not.toBe(n1);

    // inhaltlich gleich
    expect(n1.isEqual(n2)).toBe(true);
    expect(n1.getHashCode()).toBe(n2.getHashCode());

    // nach Änderung nicht mehr gleich
    n2.append("people");
    expect(n1.isEqual(n2)).toBe(false);
  });

  it("StringArrayName clone produces equal but independent copy", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2 = n1.clone() as Name;

    expect(n2).not.toBe(n1);
    expect(n1.isEqual(n2)).toBe(true);
    expect(n1.getHashCode()).toBe(n2.getHashCode());

    n2.remove(0);
    expect(n1.isEqual(n2)).toBe(false);
  });
});

// ---------------------------------------------------------
// asDataString + concat interoperability
// ---------------------------------------------------------

describe("asDataString and concat interoperability tests", () => {
  it("StringName and StringArrayName have same data representation", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);

    expect(n1.asDataString()).toBe(n2.asDataString());
  });

  it("concat(StringArrayName -> StringName) appends all components", () => {
    let base: Name = new StringName("oss.cs");
    let suffix: Name = new StringArrayName(["fau", "de"]);

    base.concat(suffix);
    expect(base.asString()).toBe("oss.cs.fau.de");
  });

  it("concat(StringName -> StringArrayName) appends all components", () => {
    let base: Name = new StringArrayName(["oss", "cs"]);
    let suffix: Name = new StringName("fau.de");

    base.concat(suffix);
    expect(base.asString()).toBe("oss.cs.fau.de");
  });
});

// ---------------------------------------------------------
// Fehlerfälle / Index-Checks (einfach gehalten)
// ---------------------------------------------------------

describe("Index range checks", () => {
  it("getComponent with invalid index throws", () => {
    let n: Name = new StringArrayName(["oss", "cs"]);
    expect(() => n.getComponent(100)).toThrow();
  });

  it("remove with invalid index throws", () => {
    let n: Name = new StringName("oss.cs");
    expect(() => n.remove(5)).toThrow();
  });

  it("insert with invalid index throws", () => {
    let n: Name = new StringArrayName(["oss", "cs"]);
    expect(() => n.insert(10, "x")).toThrow();
  });
});
