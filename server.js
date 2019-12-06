var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

idCounter = 1;

var posts = [
    {
        id: 1,
        post: "My first post",
        user : "BOb"
    },
    {
        id: 2,
        post: "My second post",
        user : "Jane"
    }
];

// GET /api/posts

app.get('/api/posts', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(posts));
});

// GET /api/posts/:id
app.get('/api/posts/:id', function(req, res){

    if(posts[req.params.id]) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(posts[req.params.id]));
    } else {
        res.status(404).send('Post Not Found')
    }
});

// POST /api/posts
// curl --data "todo=Gotostore" http://localhost:3000/api/posts

app.post('/api/posts', function(req, res){
    
    if(req.body.post && req.body.user) {
        idCounter++;
        let data = {
            id: idCounter,
            post : req.body.post,
            user: req.body.user
        };

        posts.push(data);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    } else {
        res.status(434).send('Post and user is required')
    }

});

app.listen(3000, function(){
    console.log('Todo List API is now listening on port 3000...');
})