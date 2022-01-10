const db = require('../models');
const jwt = require('jsonwebtoken');
const fs = require('fs');

/* Ajout d'une nouvelle publication */
exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;  
    
    db.User.findOne({ where: { id: userId } }) 
    .then(user => {
        db.Post.create({
            userId: userId,
            content: req.body.content,
            attachement: ( req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null )
        })
        .then(post => {
            return res.status(201).json({ post })
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ message: 'Erreur création bdd' })
        })
    })
    .catch(error => res.status(500).json({ error:"Problème lié à la base de données" }));  
};

/* Récupération des posts */
exports.getAllPosts = (req, res, next) => {
    db.Post.findAll({
        include: {
            model: db.User,
            attribute: [
                "id", "username"
            ]
        },
        order: [
            ['createdAt', 'DESC']
        ],
    })
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => res.status(500).json({ error: error }))
}

/* Récupération des commentaires */
exports.getAllComments = (req, res, next) => {
    db.Comment.findAll({
        where: { postId: req.params.id},
        include: {
            model: db.User,
            attributes: ["userId", "username"]
        },
        order: [
            ['createdAt', 'ASC']
        ],
    }) 
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(500).json({ error }))
}

/* Suppression d'un post */
exports.deletePost = (req, res, next) => {
    db.Post.findOne({ where: { id: req.params.id } })
    .then(post => {
        if(post.image) {
            console.log(post.image)
            const filename = post.image.split('/images/')[1]; // on récupère le nom du fichier à supprimer
            console.log(filename)
            fs.unlink(`images/${filename}`, () => { // on utilise la fonction unlink du package fs pour supprimer le fichier 
                post.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Post supprimé'}))
                .catch(error => res.status(400).json({ error: 'Problème lors de la suppression du post' }));
            });
        }
        post.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Post supprimé'}))
        .catch(error => res.status(400).json({ error: 'Problème lors de la suppression du post' }));
    })
    .catch(error => res.status(500).json({ error:"Problème lié à la base de données" }));
};