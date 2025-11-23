// src/adap-b03/system/ServiceMain.ts
import { ModelMain } from "./ModelMain";

export class ServiceMain extends ModelMain {

    protected serviceRunning: boolean = false;

    protected override initialize(): void {
        // Erst das Model initialisieren
        super.initialize();     // -> ModelMain.initialize() -> initModel()
        // Dann den Service starten
        this.initService();
    }

    protected initService(): void {
        console.log("ServiceMain.initService(): Service vorbereiten");
        this.serviceRunning = true;
    }

    protected override finalize(): void {
        // Zuerst Service stoppen
        this.finiService();
        // Dann das Model freigeben
        super.finalize();       // -> ModelMain.finalize() -> finiModel()
    }

    protected finiService(): void {
        console.log("ServiceMain.finiService(): Service aufräumen");
        this.serviceRunning = false;
    }

}
