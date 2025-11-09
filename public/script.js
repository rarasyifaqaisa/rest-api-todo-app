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
        
        // menjahit child
        li.appendChild(todoText);
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

document.addEventListener('DOMContentLoaded', fetchTodos);