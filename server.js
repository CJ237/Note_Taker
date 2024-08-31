const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.port || 3001;
const { readFromFile, readAndAppend } = require('/public/assets/helpers/fsUtils');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/notes', (req, res)=>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.post('/api/notes', (req, res)=>{
    const ID = crypto.randomUUID();
    console.info(`${req.method} request received to add a new note!`);
    
    const { title, text } = req.body;
    
    if(title, text){
        const newNote = {
            title,
            text,
            note_ID: ID
        };

        readAndAppend(newNote,'./db/db.json');
        res.json(`Note added successfully`);
    }else{
        res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const { notes } = req.params.id;
    let temp = [];
    fs.readFile('./db/db.json', 'utf8', (err, data)=>{
        if(err){
            console.error(err);
            return;
        }else{
            temp = JSON.parse(data);
            const index = 0;
            for(let i = 0; i < temp.length; i++){
                if(notes === temp[i].note_ID){
                    index = temp.indexOf(i);
                }
            }
            temp.splice(index, 1);
            fs.writeFile('./db/db.json', JSON.stringify(temp), (err) => 
            err ? console.log(err) : console.log('Successfully removed from db.json!'));
        }
    });
});

app.listen(PORT, ()=>
    console.log(`App listening at http://localhost:${PORT}`)
);
