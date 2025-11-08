// server
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors()); // untuk mengizinkan permintaan dari frontend
app.use(express.json());

let database = [
    {id: 1, deskripsi: 'belajar rest api', completed: false},
    {id: 2, deskripsi: 'belajar react', completed: false},
    {id: 3, deskripsi: 'belajar html & css', completed: true},
    {id: 4, deskripsi: 'belajar llm', completed: false}
]

let nextId = 5;

// routes api
// 1. mendapatkan semua data
app.get('/api/todos', (req, res) => {
    res.json(database);
})

// 2. menambahkan data baru
app.post('/api/todos', (req, res) => {
    const {deskripsi} = req.body;
    if (!deskripsi){
        return res.status(400).json({message: 'deskripsi dibutuhkan'});
    }
    
    const newData = {
        id: nextId++,
        deskripsi,
        completed: false
    }

    database.push(newData);
    res.status(201).json(newData); // 201 created
})

// 3. update data (toggle completed)
app.put('/api/todos/:id', (req, res) => {
    const idReq = parseInt(req.params.id);
    const databaseIndex = database.findIndex(data => data.id === idReq);

    if (databaseIndex === -1){
        return res.status(404).json({message: 'data tidak ditemukan'});
    }

    // mengubah status completed
    console.log(database[databaseIndex]);
    database[databaseIndex].completed = !database[databaseIndex].completed;
    res.json(database[databaseIndex]);
})

// 4. delete data berdasarkan id
app.delete('/api/todos/:id', (req, res) => {
    const idReq = parseInt(req.params.id);
    const databaseIndex = database.findIndex(data => data.id === idReq);

    if (databaseIndex === -1){
        return res.status(404).json({message: 'data tidak ditemukan'});
    }

    // kalau todonya ketemu maka kita remove dari array database
    database.splice(databaseIndex, 1);

    res.status(204).send(); // delete berhasil
})

app.listen(PORT, () => {
    console.log(`server berjalan di http://localhost:${PORT}`);
})