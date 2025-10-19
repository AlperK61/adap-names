export class File {
  private _open: boolean = false;
  private _deleted: boolean = false;
  private _data: Object[] = [];


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
      if(this._deleted) {
        throw new Error("Cannot open a deleted file.");
      }
      this._open = true;
      //throw new Error("incomplete example code");
    }

    public read(): Object[] {
      this.assertIs_openFile();
      return this._data.slice();;
      //throw new Error("incomplete example code");
    }

    public write(data: Object[]): void {
      this.assertIs_openFile();
      this._data = Array.isArray(data) ? data.slice() : [];
      //throw new Error("incomplete example code");
    }
  
    public close(): void {
      this.assertIs_openFile();
      this._open = false;
      //throw new Error("incomplete example code");
    }

    public delete(): void {
      this.assertIsClosedFile();
      if (this._deleted) {
        throw new Error("File is already deleted.");
      }
      this._deleted = true;
      this._data = [];
      //throw new Error("incomplete example code");
    }

    protected assertIs_openFile(): void {
      if (this._open) {
        throw new Error("File is not _open.");
      }
      if (this._deleted) {
        throw new Error("File is deleted.");
      }
      // throw new Error("incomplete example code");
    }

    protected assertIsClosedFile(): void {
      if (!this._open) {
        throw new Error("File is not closed.");
      }
      if (this._deleted) {
        throw new Error("File is deleted.");
      }
        //throw new Error("incomplete example code");
    }

}