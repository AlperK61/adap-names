import { describe, it, expect, vi } from "vitest";
import {
  User,
  Moderator,
  Administrator,
} from "../../../src/adap-b03/variance/Users";

describe("variance/Users – User, Moderator, Administrator", () => {
  it("User.use() schreibt eine passende Log-Nachricht", () => {
    const user = new User();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    user.use();

    expect(logSpy).toHaveBeenCalledWith("User.use() called");
    logSpy.mockRestore();
  });

  it("Moderator.moderate() schreibt eine passende Log-Nachricht", () => {
    const mod = new Moderator();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    mod.moderate();

    expect(logSpy).toHaveBeenCalledWith("Moderator.moderate() called");
    logSpy.mockRestore();
  });

  it("Administrator.administer() schreibt eine passende Log-Nachricht", () => {
    const admin = new Administrator();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    admin.administer();

    expect(logSpy).toHaveBeenCalledWith("Administrator.administer() called");
    logSpy.mockRestore();
  });

  it("User.clone() erzeugt ein neues User-Objekt", () => {
    const user = new User();
    const clone = user.clone();

    expect(clone).toBeInstanceOf(User);
    expect(clone).not.toBe(user);
  });

  it("Moderator.clone() erzeugt ein neues Moderator-Objekt", () => {
    const mod = new Moderator();
    const clone = mod.clone();

    expect(clone).toBeInstanceOf(Moderator);
    expect(clone).not.toBe(mod);
  });

  it("Administrator.clone() erzeugt ein neues Administrator-Objekt", () => {
    const admin = new Administrator();
    const clone = admin.clone();

    expect(clone).toBeInstanceOf(Administrator);
    expect(clone).not.toBe(admin);
  });
});
