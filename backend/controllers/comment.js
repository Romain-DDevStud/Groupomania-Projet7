const db = require('../models');
const jwt = require('jsonwebtoken');
const fs = require('fs');

/* Ajout d'un nouveau commentaire */
exports.createComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    db.Post.findOne({ where: { id: req.body.postId } })
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: 'Post introuvable !' })
            }
            db.Comment.create({
                content: req.body.content,
                //attachement: ( req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null ),
                postId: req.body.postId,
                userId: userId
            })
            .then(comment => res.status(201).json({ comment }))
            .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ message: "erreur création commentaire" }))
}

/* Suppression d'un commentaire */
exports.deleteComment = (req, res, next) => {
    db.Comment.findOne({ where: { id: req.params.id } })
    .then(comment => {
        if(comment.image) {
            console.log(comment.image)
            const filename = comment.image.split('/images/')[1]; // on récupère le nom du fichier à supprimer
            console.log(filename)
            fs.unlink(`images/${filename}`, () => { // on utilise la fonction unlink du package fs pour supprimer le fichier 
                comment.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Commentaire supprimé'}))
                .catch(error => res.status(400).json({ error: 'Problème lors de la suppression du commentaire' }));
            });
        }
        comment.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Commentaire supprimé'}))
        .catch(error => res.status(400).json({ error: 'Problème lors de la suppression du commentaire' }));
    })
    .catch(error => res.status(500).json({ error: "Problème lié à la base de données" }));
}