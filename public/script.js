// koneksi dengan server
const API_URL = 'http://localhost:3000/api/todos';

const todoList = document.getElementById('todoList');
const newTodoInput = document.getElementById('newTodoInput');
const addTodoBtn = document.getElementById('addTodoBtn');

// fungsi untuk menampilkan todos
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        if(!response.ok) {
            throw new Error(`error status: ${response.status}`);
        }

        const todos = await response.json();
        renderTodos(todos);
    } catch(error) {
        console.error('error fetching todos', error);
        todoList.innerHTML = '<li class="list-group-item text-danger">Komunikasi error/error loading data</li>';
    }
}

function renderTodos(todos) {
    todoList.innerHTML = ''; // mengosongkan daftar yang ada
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-conten-between align-items-center ${todo.completed ? 'list-group-item-success': ''}`;
        li.dataset.id = todo.id; // simpan id di element li

        const todoText = document.createElement('span');

        // tambahkan kelas bootstrap untuk teks punya kelakuan diklik
        todoText.className = 'flex-grow-1 me-2';
        if(todo.completed) {
            todoText.style.textDecoration = 'line-through'; // buat garis yang sudah selesai
            todoText.style.color = '#6c757d';
        }

        todoText.textContent =todo.deskripsi;

        todoText.addEventListener('click', () => ToggleTodoStatus(todo.id));

        const actionDiv = document.createElement('div');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));
        
        // menjahit child
        actionDiv.appendChild(deleteButton);
        li.appendChild(todoText);
        li.appendChild(actionDiv);
        todoList.appendChild(li);
    });
}

async function ToggleTodoStatus(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT'
        });

        if(!response.ok) {
            throw new Error(`error status: ${response.status}`);
        }

        const updateTodo = await response.json();
        console.log('toggle todo: ', updateTodo);
        fetchTodos();
    } catch(error) {
        console.error('error toggling todos status', error);
    }
}

async function addTodo() {
    const deskripsi = newTodoInput.value.trim();
    if(!deskripsi) {
        alert('jangan kosong');
        return;
    }

    let data = {'deskripsi': deskripsi};
    try {
        console.log (JSON.stringify(data));
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(!response.ok) {
            throw new Error(`error status: ${response.status}`);
        }

        const newTodo = await response.json();
        console.log('todo baru sudah ditambah: ', newTodo);
        newTodoInput.value = '';
        fetchTodos();
    } catch(error) {
        console.error('error adding todo status', error);
    }
}

async function deleteTodo(id) {
    if(!confirm('apakah anda yakin untuk menghapus todo ini?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })

        if(!response.ok) {
            if(response.status == 204) {
                console.log(`Todo ${id} sukses dihapus`);
            } else {
                throw new Error(`error ${response.status}`);
            }
        }
    } catch(error) {
        console.error('error delete todo', error);
    }
}

addTodoBtn.addEventListener('click', addTodo);
document.addEventListener('DOMContentLoaded', fetchTodos);