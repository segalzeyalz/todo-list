import { Component } from '@angular/core';
import { Task } from './types'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-list';
  currentTask: any = null;
  tasks: Task[] = [];

  addTask() {
    if (!this.currentTask) {
      return;
    }
    const task = { text: this.currentTask, checked: false, index: this.tasks.length } as Task;
    this.tasks.push(task);
    this.currentTask = '';
  }

  toggleCheck(task: Task) {
    this.tasks[task.index].checked = !this.tasks[task.index].checked;
  }

  writeTask(eventTarget: any) {
    this.currentTask = (eventTarget as HTMLInputElement).value;
  }
}
