import {Component, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

    private todoList: TodoListData; 
    private filterData = '';
    private todoListForQR;
    
    constructor(private todoService: TodoService) {
        todoService.getTodoListDataObservable().subscribe( tdl => this.todoList = tdl);
    }

    ngOnInit() {
    }
    
    get label(): string {
        return this.todoList.label;
    }
    
    get items(): TodoItemData[] {
        if(this.filterData == 'completed'){
            return this.todoList.items.filter(I => I.isDone == true);
        }else if(this.filterData == 'actif'){
            return this.todoList.items.filter(I => I.isDone == false);
        }else{
            return this.todoList.items;
        }
    }

    get nbofActif(): number {
        return this.todoList.items.filter(I => I.isDone == false).length;
        
    }

    appendItem(label: string){
        this.todoService.appendItems({
            label,
            isDone:false,
            isEdit:false
        });
    }

    itemDone(item: TodoItemData, done:boolean){
        this.todoService.setItemsDone(done,item);
    }

    itemLabel(item: TodoItemData, label:string){
        item.isEdit = false;
        this.todoService.setItemsLabel(label,item);
    }

    itemEdit(item: TodoItemData, edit:boolean){
        this.todoService.setItemsEdit(edit,item);
    }
  
    itemDelete(item: TodoItemData) {
        this.todoService.removeItems(item);
    } 

    itemDeleteChecked() {
        this.todoService.removeCheckedItems();
    } 

    deleteAll(){
        this.todoService.removeAllItems();
    }

    ApplyFilter(category: string) {
        this.filterData = category; 
    } 

    generateDataQR(){
        this.todoListForQR = this.todoList;
        this.todoListForQR.items.forEach(e => {
            delete e.isEdit;
        });
        this.todoListForQR = JSON.stringify(this.todoListForQR, null, 2);
    }
}