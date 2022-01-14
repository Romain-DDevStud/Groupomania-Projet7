require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

/* Avec password-validator, création d'un schéma pour meiller sécurisation du MDP */
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
schema 
    .is().min(8)
    .has().digits(1)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().symbols(1)
    .has().not().spaces();

/* Ajout d'un nouvel utilisateur */
exports.signup = (req, res, next) => {
    const usernameExists =  db.User.findOne({where: { username: req.body.username } })
    .then(usernameExists => {
        if (usernameExists) {
            return res.status(401).json({ error: "Le username est déjà utilisé" });
        }
    })  
    const emailExists =  db.User.findOne({where: { email: req.body.email } })
    .then(emailExists => {
        if (emailExists) {
            return res.status(401).json({ error: "L'email existe déjà" });
        }
    })  
    if (!schema.validate(req.body.password)) {
        // Vérifie que le schema de mot de passe est bien respecté
        res.status(401).json({
            error: `Mot de passe invalide, il doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule, un symbole et ne pas contenir d'espace !`,
        });
        return false;
    }
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        console.log(hash);
        console.log(db);
        console.log("body",req.body)
        const user = db.User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash ,
            attachementuser: ( req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null )
        })
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/* Connexion d'un utilisateur */ 
exports.login = (req, res, next) => {
    console.log('Hello login !')
    const user = db.User.findOne({where: { email: req.body.email } })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                role: user.role,
                userId: user.id,
                token: jwt.sign(
                { userId: user.id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/* Récupération d'un utilisateur */
exports.getCurrentUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    console.log(decodedToken);
    const userId = decodedToken.userId;
    console.log(userId);
    db.User.findOne({ where: { id: userId }})
    .then(user => {
        res.status(200).json({
            userId: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            attachementuser: user.attachementuser
        });
    })
    .catch(error => res.status(500).json({ error: 'erreur bdd-recupUser' }))
}
/* Récupération de tous les utilisateurs */
exports.getAllUsers = (req, res, next) => {
    db.User.findAll({
        include: {
            model: db.Post,
            attribute: [
                "username"
            ]
        },
        order: [
            ['createdAt', 'ASC']
        ],
    })
    .then(users => res.status(200).json(users))
    .catch(error => res.status(500).json({ error }))
}

/* Supprimer son compte utilisateur */
exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    console.log("userId--------------------------------",userId);
    db.User.findOne({ where: { id: userId  }})
    .then(user => {
        user.destroy({ where: { id: userId }})
        .then(() => res.status(200).json({ message: 'Compte supprimé'}))
        .catch(error => res.status(400).json({ error: 'Problème lors de la suppression du compte' }));
    })
    .catch(error => res.status(500).json({ error:"Problème lié à la base de données" }));
};

