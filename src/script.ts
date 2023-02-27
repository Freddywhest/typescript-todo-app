type Todo = {
    id: number | string,
    title: string,
    detail: string,
    status: boolean,
    date: Date
};

type Todos = {
    readonly id: number | string,
    title: string,
    detail: string,
    status: boolean,
    date: Date
}[];


type AddTodoResponse = { message: string, status: boolean }

const addTodoForm : HTMLFormElement | null = document.querySelector<HTMLFormElement>('#addTodo');
const todoTitle: HTMLInputElement | null = document.querySelector<HTMLInputElement>('[name="title"]');
const todoDetail: HTMLInputElement | null = document.querySelector<HTMLInputElement>('[name="detail"]');
const todoList: HTMLElement | null = document.querySelector<HTMLElement>('.todo-list');
const addedMsg: HTMLElement | null = document.querySelector<HTMLElement>('.addedMsg');

let _doneBtn: NodeListOf<HTMLButtonElement> | null;
let _undoBtn: NodeListOf<HTMLButtonElement> | null;
let _deleteBtn: NodeListOf<HTMLButtonElement> | null;

async function AddTodo (NewTodo: Todo): Promise<AddTodoResponse | undefined> {
    try {
        const todos: [] = await JSON.parse(localStorage.getItem('todos') || "[]");
        const NewTodos : [Todo] = [
            ...todos,
            NewTodo
        ];
        if(!todos.length || !Object.keys(todos))
            localStorage.setItem('todos', JSON.stringify(NewTodos));
        else
            todos.map((n : Todo) => {
                if(n.id !== NewTodo.id)
                    localStorage.setItem('todos', JSON.stringify(NewTodos)); 
            });
        
        return {
            message: "Todo added successfully!",
            status: true
        };
        
    } catch (e: any) {
        console.log(e);
        
    }
}


async function GetTodos (): Promise<Todos | undefined> {
    const _getTodos: string = localStorage.getItem('todos') || "[]";
    const _todos: [] = await JSON.parse(_getTodos);
    return _todos;
}

function DisplayTodos (todos: Todos): void{
    todoList!.innerHTML = '';
    let _todos = todos.sort((a,b) => {
        var dateA: number = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1; 
    });

    todoList!.innerHTML += `${_todos.map((todo) => 
         `<li class="todo-li">
            <div class=" ${todo?.status ? 'todo-done' : ''}">
                <span class="span"><b>Title:</b> ${todo?.title}</span>
                <span class="span"><strong>Details:</strong> ${todo?.detail} </span>
                <span class="date"><b>Date:</b> ${(todo?.date as unknown as string).split('T')[0]}</span>
            </div>
            <span">
            ${todo?.status ? `
                <button id="__undo" tid="${todo?.id}">Undo</button>
                <button id="__delete" tid="${todo?.id}">Delete</button>
            ` : `
                <button id="__done" tid="${todo?.id}">Done</button>
            ` }
            </span>
        </li>`
    ).join('')}` 
}

function DeleteTodo(): void {
    if(document.querySelectorAll<HTMLButtonElement>('#__delete'))
        _deleteBtn = document.querySelectorAll<HTMLButtonElement>('#__delete');
        _deleteBtn?.forEach((deleteBtn: HTMLButtonElement) => {
            deleteBtn.addEventListener('click', async (e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                const todoId: number | null = parseInt(deleteBtn.getAttribute('tid') || "");
                const _allTodos: Todos | undefined = await GetTodos();
                const newSetOfTodos: Todos | undefined = _allTodos?.filter(n => n.id !== todoId);
                const _newSetOfTodos: string = JSON.stringify(newSetOfTodos);
                localStorage.setItem('todos', _newSetOfTodos);
                const _updatedTodos = await GetTodos();
                DisplayTodos(_updatedTodos || []);
            });
        });
}

function DoneTodo(): void {
    if(document.querySelectorAll<HTMLButtonElement>('#__done'))
        _doneBtn = document.querySelectorAll<HTMLButtonElement>('#__done');
        _doneBtn?.forEach((doneBtn: HTMLButtonElement) => {
            doneBtn.addEventListener('click', async (e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                const latestTodo: Todos = [];
                const todoId: number | null = parseInt(doneBtn.getAttribute('tid') || "");
                const _allTodos: Todos | undefined = await GetTodos();
                _allTodos?.forEach((todo: Todo) => {
                    if(todo.id === todoId){
                        todo.status = !todo.status
                    }
                    
                   latestTodo.push(todo);
                });
                
                const _newSetOfTodos: string = JSON.stringify(latestTodo);
                localStorage.setItem('todos', _newSetOfTodos);
                const _updatedTodos = await GetTodos();
                DisplayTodos(_updatedTodos || []);
            });
        });
}

function UndoTodo(): void {
    if(document.querySelectorAll<HTMLButtonElement>('#__undo'))
        _undoBtn = document.querySelectorAll<HTMLButtonElement>('#__undo');
        _undoBtn?.forEach((undoBtn: HTMLButtonElement) => {
            undoBtn.addEventListener('click', async (e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                const latestTodo: Todos = [];
                const todoId: number | null = parseInt(undoBtn.getAttribute('tid') || "");
                const _allTodos: Todos | undefined = await GetTodos();
                _allTodos?.forEach((todo: Todo) => {
                    if(todo.id === todoId){
                        todo.status = !todo.status
                    }
                    
                   latestTodo.push(todo);
                });
                
                const _newSetOfTodos: string = JSON.stringify(latestTodo);
                localStorage.setItem('todos', _newSetOfTodos);
                const _updatedTodos = await GetTodos();
                DisplayTodos(_updatedTodos || []);
            });
        });
}

addTodoForm?.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    todoList!.innerHTML = '';

    let title: string = todoTitle!.value;
    let detail: string = todoDetail!.value;
    let date: Date = new Date();
    let id = (new Date()).getTime();
    let status: boolean = false;

    if(!title && !detail)
        return addedMsg!.innerHTML = `<span style="color: red">Title and Detail of Todo shouldn't be empty!</span>`;
    else if(!title || !detail)
        return addedMsg!.innerHTML = `<span style="color: red">${!title ? 'Title' : 'Detail'} of Todo shouldn't be empty!</span>`;
    
    const _todoValues: Todo = { id, title, detail, date, status };
    const _addedTodo = await AddTodo(_todoValues);
    todoDetail!.value = '';
    todoTitle!.value = '';
    if(_addedTodo?.status)
        setTimeout((() => {
            addedMsg!.innerHTML = '';
        }), 5000)

        addedMsg!.innerHTML = `<span style="color: green">${_addedTodo?.message}</span>`;
        
        const _updatedTodos = await GetTodos();
        DisplayTodos(_updatedTodos || []);
    
})


window.addEventListener('load', async () : Promise<void> => {
    const _todos = await GetTodos();
    DisplayTodos(_todos || []);
    DeleteTodo();
    DoneTodo();
    UndoTodo();
});


window.addEventListener('mousemove', () => {
    DeleteTodo();
    DoneTodo();
    UndoTodo();
})
