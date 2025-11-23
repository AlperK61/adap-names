// src/adap-b03/system/MyAppMain.ts
import { ServiceMain } from "./ServiceMain";

export class MyAppMain extends ServiceMain {

    protected override execute(): void {
        // App-spezifischer Ablauf in der richtigen Reihenfolge
        this.loadModel();
        this.startService();

        // Hier würde "eigentliche" Applikationslogik laufen

        this.saveModel();
        this.closeService();
    }

    protected loadModel(): void {
        console.log("MyAppMain.loadModel(): Model laden");
        if (this.model == null) {
            this.model = { loaded: true };
        }
    }

    protected startService(): void {
        console.log("MyAppMain.startService(): Service starten");
        this.serviceRunning = true;
    }

    protected saveModel(): void {
        console.log("MyAppMain.saveModel(): Model speichern");
        // optional: persistieren
    }

    protected closeService(): void {
        console.log("MyAppMain.closeService(): Service beenden");
        this.serviceRunning = false;
    }

}
