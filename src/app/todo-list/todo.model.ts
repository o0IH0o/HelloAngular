export class Todo {
  private title = '';
  private completed = false;
  private editmode = false;

  constructor(title: string) {
    this.title = title || ''; // 為避免傳入的值為 Falsy 值，稍作處理
  }

  get done(): boolean {
    return this.completed;
  }

  getTitle(): string {
    return this.title;
  }

  toggleCompletion(): void {
    this.completed = !this.completed;
  }

  get editing(): boolean{
    return this.editmode;
  }

  set editable(status: boolean){
    this.editmode = status;
  }

  setTitle(title: string): void{
    this.title = title;
  }

  setCompleted(completed: boolean): void {
    this.completed = completed;
  }
}
