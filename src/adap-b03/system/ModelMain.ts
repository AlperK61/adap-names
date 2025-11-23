// src/adap-b03/system/ModelMain.ts
import { Main } from "./Main";

export class ModelMain extends Main {

    // Zustand des Models, im Test über (mm as any).model abgefragt
    protected model: any | null = null;

    protected override initialize(): void {
        // ggf. Vorbereitung aus Main
        super.initialize();
        // dann Model initialisieren
        this.initModel();
    }

    protected initModel(): void {
        console.log("ModelMain.initModel(): initialisiere Model");
        // Beliebiges nicht-null Objekt reicht für die Tests
        this.model = {};
    }

    protected override finalize(): void {
        // zuerst Model freigeben
        this.finiModel();
        // dann evtl. Aufräumen aus Main
        super.finalize();
    }

    protected finiModel(): void {
        console.log("ModelMain.finiModel(): Model freigeben");
        this.model = null;
    }

}
