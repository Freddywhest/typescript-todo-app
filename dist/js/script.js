"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const addTodoForm = document.querySelector('#addTodo');
const todoTitle = document.querySelector('[name="title"]');
const todoDetail = document.querySelector('[name="detail"]');
const todoList = document.querySelector('.todo-list');
const addedMsg = document.querySelector('.addedMsg');
const formInputs = document.querySelectorAll('input');
const formTextareas = document.querySelectorAll('textarea');
let _doneBtn;
let _undoBtn;
let _deleteBtn;
function AddTodo(NewTodo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const todos = yield JSON.parse(localStorage.getItem('todos') || "[]");
            const NewTodos = [
                ...todos,
                NewTodo
            ];
            if (!todos.length || !Object.keys(todos))
                localStorage.setItem('todos', JSON.stringify(NewTodos));
            else
                todos.map((n) => {
                    if (n.id !== NewTodo.id)
                        localStorage.setItem('todos', JSON.stringify(NewTodos));
                });
            return {
                message: "Todo added successfully!",
                status: true
            };
        }
        catch (e) {
            console.log(e);
        }
    });
}
function GetTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const _getTodos = localStorage.getItem('todos') || "[]";
        const _todos = yield JSON.parse(_getTodos);
        return _todos;
    });
}
function DisplayTodos(todos) {
    todoList.innerHTML = '';
    let _todos = todos.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
    });
    todoList.innerHTML += `${_todos.map((todo) => `<li class="todo-li">
            <div class=" ${(todo === null || todo === void 0 ? void 0 : todo.status) ? 'todo-done' : ''}">
                <span class="span"><b>Title:</b> ${todo === null || todo === void 0 ? void 0 : todo.title}</span>
                <span class="span"><strong>Details:</strong> ${todo === null || todo === void 0 ? void 0 : todo.detail} </span>
                <span class="date"><b>Date:</b> ${(todo === null || todo === void 0 ? void 0 : todo.date).split('T')[0]}</span>
            </div>
            <span">
            ${(todo === null || todo === void 0 ? void 0 : todo.status) ? `
                <button id="__undo" tid="${todo === null || todo === void 0 ? void 0 : todo.id}">Undo</button>
                <button id="__delete" tid="${todo === null || todo === void 0 ? void 0 : todo.id}">Delete</button>
            ` : `
                <button id="__done" tid="${todo === null || todo === void 0 ? void 0 : todo.id}">Done</button>
            `}
            </span>
        </li>`).join('')}`;
}
function DeleteTodo() {
    if (document.querySelectorAll('#__delete'))
        _deleteBtn = document.querySelectorAll('#__delete');
    _deleteBtn === null || _deleteBtn === void 0 ? void 0 : _deleteBtn.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            const todoId = parseInt(deleteBtn.getAttribute('tid') || "");
            const _allTodos = yield GetTodos();
            const newSetOfTodos = _allTodos === null || _allTodos === void 0 ? void 0 : _allTodos.filter(n => n.id !== todoId);
            const _newSetOfTodos = JSON.stringify(newSetOfTodos);
            localStorage.setItem('todos', _newSetOfTodos);
            const _updatedTodos = yield GetTodos();
            DisplayTodos(_updatedTodos || []);
        }));
    });
}
function DoneTodo() {
    if (document.querySelectorAll('#__done'))
        _doneBtn = document.querySelectorAll('#__done');
    _doneBtn === null || _doneBtn === void 0 ? void 0 : _doneBtn.forEach((doneBtn) => {
        doneBtn.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            const latestTodo = [];
            const todoId = parseInt(doneBtn.getAttribute('tid') || "");
            const _allTodos = yield GetTodos();
            _allTodos === null || _allTodos === void 0 ? void 0 : _allTodos.forEach((todo) => {
                if (todo.id === todoId) {
                    todo.status = !todo.status;
                }
                latestTodo.push(todo);
            });
            const _newSetOfTodos = JSON.stringify(latestTodo);
            localStorage.setItem('todos', _newSetOfTodos);
            const _updatedTodos = yield GetTodos();
            DisplayTodos(_updatedTodos || []);
        }));
    });
}
function UndoTodo() {
    if (document.querySelectorAll('#__undo'))
        _undoBtn = document.querySelectorAll('#__undo');
    _undoBtn === null || _undoBtn === void 0 ? void 0 : _undoBtn.forEach((undoBtn) => {
        undoBtn.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            const latestTodo = [];
            const todoId = parseInt(undoBtn.getAttribute('tid') || "");
            const _allTodos = yield GetTodos();
            _allTodos === null || _allTodos === void 0 ? void 0 : _allTodos.forEach((todo) => {
                if (todo.id === todoId) {
                    todo.status = !todo.status;
                }
                latestTodo.push(todo);
            });
            const _newSetOfTodos = JSON.stringify(latestTodo);
            localStorage.setItem('todos', _newSetOfTodos);
            const _updatedTodos = yield GetTodos();
            DisplayTodos(_updatedTodos || []);
        }));
    });
}
addTodoForm === null || addTodoForm === void 0 ? void 0 : addTodoForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    todoList.innerHTML = '';
    let title = todoTitle.value;
    let detail = todoDetail.value;
    let date = new Date();
    let id = (new Date()).getTime();
    let status = false;
    const _prevTodos = yield GetTodos();
    if (!title && !detail) {
        addedMsg.innerHTML = `<span style="color: red">Title and Detail of Todo shouldn't be empty!</span>`;
        DisplayTodos(_prevTodos || []);
        return;
    }
    else if (!title || !detail) {
        addedMsg.innerHTML = `<span style="color: red">${!title ? 'Title' : 'Detail'} of Todo shouldn't be empty!</span>`;
        DisplayTodos(_prevTodos || []);
        return;
    }
    const _todoValues = { id, title, detail, date, status };
    const _addedTodo = yield AddTodo(_todoValues);
    todoDetail.value = '';
    todoTitle.value = '';
    if (_addedTodo === null || _addedTodo === void 0 ? void 0 : _addedTodo.status)
        setTimeout((() => {
            addedMsg.innerHTML = '';
        }), 5000);
    addedMsg.innerHTML = `<span style="color: green">${_addedTodo === null || _addedTodo === void 0 ? void 0 : _addedTodo.message}</span>`;
    const _updatedTodos = yield GetTodos();
    DisplayTodos(_updatedTodos || []);
}));
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    const _todos = yield GetTodos();
    DisplayTodos(_todos || []);
    DeleteTodo();
    DoneTodo();
    UndoTodo();
}));
formInputs === null || formInputs === void 0 ? void 0 : formInputs.forEach((formInput) => {
    formInput.addEventListener('input', (e) => {
        e.preventDefault();
        addedMsg.innerHTML = '';
    });
});
formTextareas === null || formTextareas === void 0 ? void 0 : formTextareas.forEach((formTextarea) => {
    formTextarea.addEventListener('input', (e) => {
        e.preventDefault();
        addedMsg.innerHTML = '';
    });
});
window.addEventListener('mousemove', () => {
    DeleteTodo();
    DoneTodo();
    UndoTodo();
});
