import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { TodoListService } from './todo-list.service';

import { Todo } from './todo.model';

import { TodoStatusType } from './todo-status-type.enum';

import { HttpClient, HttpParams } from '@angular/common/http';


export interface ItemsResponse {
  list: string[];
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})


export class TodoListComponent implements OnInit {

  constructor(private todoListService: TodoListService, private http: HttpClient ) { }

  @ViewChild('editedtodo') editInput: ElementRef;

  todoStatusType = TodoStatusType;
  private status = TodoStatusType.All;

  private firstOpenFlag = true;
  private buffer;
  private context: ItemsResponse;
  heroesUrl = 'http://127.0.0.1:5000/';

  ngOnInit(): void {
  }

  edit(todo: Todo): void{
    todo.editable = true;
    setTimeout(() => { this.editInput.nativeElement.focus(); }, 0);
  }

  update(todo: Todo, newTitle: string): void{

    if (!todo.editing){
      return;
    }

    const title = newTitle.trim();

    if (title) {
      todo.setTitle(title);
      todo.editable = false;
    }
    else{
      const index = this.getList().indexOf(todo);
      if (index !== -1){
        this.remove(index);
      }
    }
  }

  cancelEdit(todo: Todo): void{
    todo.editable = false;
  }

  addTodo(inputRef: HTMLInputElement): void {
    const todo = inputRef.value.trim();

    if (todo) {
      this.todoListService.add(todo);
      inputRef.value = '';
    }
  }

  remove(index: number): void {
    this.todoListService.remove(index);
  }

  getList(): Todo[] {

    let list: Todo[] = [];

    switch (this.status) {

      case TodoStatusType.Active:
        list = this.getRemainingList();
        break;

      case TodoStatusType.Completed:
        list = this.getCompletedList();
        break;

      default:
        if (this.firstOpenFlag){
          this.firstOpenFlag = false;
          this.http.get(this.heroesUrl, {responseType: 'text'}).subscribe(data => {
            console.log(data);
            this.buffer = data;
            this.todoListService.add(this.buffer);
          });
          this.http.get<any>(this.heroesUrl).subscribe((data) => {
            console.log(data.listData);
            data.listData.forEach(element => {
              console.log(element);
              this.todoListService.add(element);
            });
            console.log('here');
          });
          // this.http.get<string>(this.heroesUrl, options).subscribe(value => buffer = value);
        }
        list = this.todoListService.getList();
        break;

    }

    return list;
  }

  getRemainingList(): Todo[] {
    return this.todoListService.getWithCompleted(false);
  }

  getCompletedList(): Todo[] {
    return this.todoListService.getWithCompleted(true);
  }

  setStatus(status: number): void {
    this.status = status;
  }

  checkStatus(status: number): boolean {
    return this.status === status;
  }

  removeCompleted(): void {
    this.todoListService.removeCompleted();
  }

  getAllList(): Todo[] {
    return this.todoListService.getList();
  }

  allCompleted(): boolean {
    return this.getAllList().length === this.getCompletedList().length;
  }

  setAllTo(completed: boolean): void {

    this.getAllList().forEach((todo) => {
      todo.setCompleted(completed);
    });

  }
}
