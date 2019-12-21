const config = {
    host: 'localhost',
    port: 5432,
    database: 'social_feed',
    user: 'postgres'
};

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

const bcrypt = require('bcrypt');

const pgp = require('pg-promise')();
const db = pgp(config);

const Sequelize = require('sequelize')
const UsersModel = require('./models/users')
const PostsModel = require('./models/posts')
const CommentsModel = require('./models/comments')

const sequelize = new Sequelize('social_feed', 'postgres', '', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

//Models
const Users = UsersModel(sequelize, Sequelize)
const Posts = PostsModel(sequelize, Sequelize)
const Comments = CommentsModel(sequelize, Sequelize)


//Joins
Users.hasMany(Posts, {foreignKey: 'user_id'})
Posts.belongsTo(Users, {foreignKey: 'user_id'})



var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())


app.get('/api/posts', function (req, res) {

    Posts.findAll({include: [Users]}).then((results) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });

});

app.get('/api/posts/:id', function (req, res) {
    let id = req.params.id;

    db.one("SELECT * FROM posts WHERE id=$1", [id])
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
});

//Example curl : curl --data "title=homewardbound&body=greatbook&user_id=1" http://localhost:3000/api/posts
app.post('/api/posts', function (req, res) {

    let data = {
        title: req.body.title,
        body: req.body.body,
        user_id: req.body.user_id,
        image_url: req.body.image_url
    };

    Posts.create(data).then(function (post) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(post));
    });
});

app.put('/api/posts/:id', function (req, res) {
    let id = req.params.id;

    let data = {
        id: id,
        title: req.body.title,
        body: req.body.body,
        image_url: req.body.image_url
    };

    let query = "UPDATE posts SET title=${title}, body=${body}, image_url=${image_url} WHERE id=${id}";

    db.one(query, data)
        .then((result) => {

            db.one("SELECT * FROM posts JOIN users ON posts.user_id=users.id WHERE posts.id=$1", [result.id])
                .then((results) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                })
                .catch((e) => {
                    console.error(e);
                });

        })
        .catch((e) => {
            console.error(e);
        });
});

app.delete('/api/posts/:id', function (req, res) {
    let id = req.params.id;
    let query = `DELETE FROM posts WHERE id=${id}`;

    db.result(query)
        .then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        })
        .catch((e) => {
            console.error(e);
        });
});

//Example curl : curl --data "name=john&email=john@example.com&password=abc123" http://localhost:3000/api/register
app.post('/api/register', function (req, res) {

    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    if (data.name && data.email && data.password) {

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);

        data['password'] = hash;

        Users.create(data).then(function (user) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        });;

    } else {
        res.status(434).send('Name, email and password is required to register')
    }
});


app.post('/api/login', function (req, res) {

    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {

        Users.findOne({
            where: {
                email: email
            },

        }).then((results) => {
            
            bcrypt.compare(password, results.password).then(function(matched) {
                if (matched) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                } else {
                    res.status(434).send('Email/Password combination did not match')
                }
            });

            
        }).catch((e) => {
            res.status(434).send('Email does not exist in the database')
        });


    } else {
        res.status(434).send('Both email and password is required to login')
    }

});

app.get('/api/comments', function (req, res) {
    db.query('SELECT * FROM comments JOIN users on comments.user_id = users.id')
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
});

app.get('/api/comments/user/:id', function (req, res) {
    let id = req.params.id;

    db.query('SELECT * FROM comments JOIN users on comments.user_id = users.id WHERE users.id=$1', [id])
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
});

app.get('/api/comments/post/:id', function (req, res) {
    let id = req.params.id;

    db.query('SELECT * FROM comments JOIN users on comments.user_id = users.id WHERE comments.post_id=$1', [id])
        .then((results) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
        })
        .catch((e) => {
            console.error(e);
        });
});


app.get('/api/users', function (req, res) {

    Users.findAll().then((results) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
});



app.listen(3000, function () {
    console.log('Todo List API is now listening on port 3000...');
})