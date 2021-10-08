const express = require('express');
const path = require('path');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messages');
const commentRoutes = require('./routes');
const likeRoutes = require('./routes');

// lancement de Express
const app = express();

// middleware pour gestion erreur de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;