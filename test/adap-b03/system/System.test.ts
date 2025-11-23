import { describe, it, expect } from "vitest";

import { Main } from "../../../src/adap-b03/system/Main";
import { ModelMain } from "../../../src/adap-b03/system/ModelMain";
import { ServiceMain } from "../../../src/adap-b03/system/ServiceMain";
import { MyAppMain } from "../../../src/adap-b03/system/MyAppMain";

//
// 1. Tests für Main.run – Reihenfolge parseArgs → initialize → execute → finalize
//
describe("Main lifecycle tests", () => {
  class TestMain extends Main {
    public sequence: string[] = [];
    public receivedArgs: string[] = [];

    protected override parseArgs(args: string[]): void {
      this.sequence.push("parseArgs");
      this.receivedArgs = args;
      super.parseArgs(args);
    }

    protected override initialize(): void {
      this.sequence.push("initialize");
      super.initialize();
    }

    protected override execute(): void {
      this.sequence.push("execute");
      super.execute();
    }

    protected override finalize(): void {
      this.sequence.push("finalize");
      super.finalize();
    }
  }

  it("run() calls methods in correct order", () => {
    const main = new TestMain();
    main.run(["a", "b"]);

    expect(main.sequence).toEqual([
      "parseArgs",
      "initialize",
      "execute",
      "finalize",
    ]);
    expect(main.receivedArgs).toEqual(["a", "b"]);
  });
});

//
// 2. Tests für ModelMain – initModel / finiModel + model-Zustand
//
describe("ModelMain lifecycle tests", () => {
  class TestModelMain extends ModelMain {
    public modelDuringExecute: any = undefined;

    protected override execute(): void {
      // prüfe, ob das Model zum Zeitpunkt von execute() initialisiert ist
      this.modelDuringExecute = (this as any).model;
    }
  }

  it("ModelMain initializes and finalizes model correctly", () => {
    const mm = new TestModelMain();

    // vor run: model sollte null sein
    expect((mm as any).model).toBeNull();

    mm.run([]);

    // während execute: model war gesetzt
    expect(mm.modelDuringExecute).not.toBeNull();

    // nach finalize: model wieder freigegeben
    expect((mm as any).model).toBeNull();
  });
});

//
// 3. Tests für ServiceMain – initService / finiService + serviceRunning-Flag
//
describe("ServiceMain lifecycle tests", () => {
  class TestServiceMain extends ServiceMain {
    public sequence: string[] = [];
    public serviceRunningDuringExecute: boolean | undefined;

    protected override initModel(): void {
      this.sequence.push("initModel");
      super.initModel();
    }

    protected override initService(): void {
      this.sequence.push("initService");
      super.initService();
    }

    protected override execute(): void {
      this.sequence.push("execute");
      // hier prüfen wir auch gleich das Flag
      this.serviceRunningDuringExecute = (this as any).serviceRunning;
    }

    protected override finiService(): void {
      this.sequence.push("finiService");
      super.finiService();
    }

    protected override finiModel(): void {
      this.sequence.push("finiModel");
      super.finiModel();
    }
  }

  it("ServiceMain calls initModel, initService, execute, finiService, finiModel in order", () => {
    const sm = new TestServiceMain();

    // vor run: Service aus
    expect((sm as any).serviceRunning).toBe(false);

    sm.run([]);

    // Reihenfolge checken
    expect(sm.sequence).toEqual([
      "initModel",
      "initService",
      "execute",
      "finiService",
      "finiModel",
    ]);

    // während execute: Service an
    expect(sm.serviceRunningDuringExecute).toBe(true);

    // nach finalize: Service wieder aus
    expect((sm as any).serviceRunning).toBe(false);
  });
});

//
// 4. Tests für MyAppMain – execute() ruft loadModel/startService/saveModel/closeService auf
//
describe("MyAppMain execute flow tests", () => {
  class TestMyAppMain extends MyAppMain {
    public calls: string[] = [];

    protected override loadModel(): void {
      this.calls.push("loadModel");
      super.loadModel();
    }

    protected override startService(): void {
      this.calls.push("startService");
      super.startService();
    }

    protected override saveModel(): void {
      this.calls.push("saveModel");
      super.saveModel();
    }

    protected override closeService(): void {
      this.calls.push("closeService");
      super.closeService();
    }
  }

  it("MyAppMain.execute() calls load/start/save/close in order", () => {
    const app = new TestMyAppMain();

    // wir rufen hier nur execute(), nicht den ganzen run()-Zyklus
    app["execute"]();

    expect(app.calls).toEqual([
      "loadModel",
      "startService",
      "saveModel",
      "closeService",
    ]);

    // nach execute(): Model gesetzt, Service gestoppt
    expect((app as any).model).not.toBeNull();
    expect((app as any).serviceRunning).toBe(false);
  });

  it("MyAppMain.run() integriert Lifecycle von Main/Model/Service", () => {
    const app = new TestMyAppMain();
    app.run([]);

    // nach vollständigem Lauf ist Service gestoppt und Model finalisiert
    expect((app as any).serviceRunning).toBe(false);
    expect((app as any).model).toBeNull();
  });
});
