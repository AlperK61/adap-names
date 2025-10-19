import { File } from "./File";

export class ObjFile implements File {

    protected data: Object[] = [];
    protected length: number = 0;

    // interner Zustand
    private _open: boolean = false;
    private _deleted: boolean = false;

    public isEmpty(): boolean {
      return this.length == 0;
    }

    public isOpen(): boolean {
      return this._open;
      //throw new Error("incomplete example code");
    }
  
    public isClosed(): boolean {
      return !this._open;
        //throw new Error("incomplete example code");
    }
  
    public open(): void {
      this.assertIsClosedFile();
      if (this._deleted) {
        throw new Error("Cannot open a deleted file.");
      }
      this._open = true;
      //throw new Error("incomplete example code");
    }

    public read(): Object[] {
      this.assertIsOpenFile();
      return this.data.slice();;
      //throw new Error("incomplete example code");
    }

    public write(data: Object[]): void {
    this.assertIsOpenFile();
    this.data = Array.isArray(data) ? data.slice() : [];
      //throw new Error("incomplete example code");
    }
  
    public close(): void {
      this.assertIsOpenFile();
      this._open = false;
      //throw new Error("incomplete example code");
    }

    public delete(): void {
      this.assertIsClosedFile();
      if (this._deleted) {
        throw new Error("File is already deleted.");
      }
      this._deleted = true;
      this.data = [];
      this.length = 0;
      
      //throw new Error("incomplete example code");
    }

    protected assertIsOpenFile(): void {
      if (this._deleted) {
        throw new Error("File is deleted.");
      }
      if (!this._open) {
        throw new Error("File is not open.");
      }
        //throw new Error("incomplete example code");
    }

    protected assertIsClosedFile(): void {
      if (this._deleted) {
        throw new Error("File is deleted.");
      }
      if (this._open) {
        throw new Error("File is not closed.");
      }
        //throw new Error("incomplete example code");
    }

}