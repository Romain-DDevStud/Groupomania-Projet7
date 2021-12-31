require('dotenv').config();
const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');
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
        //Vérifie si  le schema de mot de passe est pas respecté
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
            password: hash
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
                userId: user.uuid,
                token: jwt.sign(
                { userId: user.uuid },
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
    db.User.findOne({ where: { uuid: userId } })
    .then(user => {
        res.status(200).json({
            userId: user.uuid,
            username: user.username,
            email: user.email,
            role: user.role
        });
    })
    .catch(error => res.status(500).json({ error: 'erreur bdd' }))
}
/* Récupération de tous les utilisateurs */
exports.getAllUsers = (req, res, next) => {
    db.User.findAll({
        order: [
            ['name', 'ASC']
        ],
    })
    .then(users => res.status(200).json(users))
    .catch(error => res.status(500).json({ error }))
}

/* Supprimer son compte utilisateur */
exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    console.log(decodedToken);

    const userId = decodedToken.userId; 
    db.User.findOne({ where: { uuid: userId  } })
    .then(user => {
        user.destroy({ where: { id: req.params.uuid } })
        .then(() => res.status(200).json({ message: 'Compte supprimé'}))
        .catch(error => res.status(400).json({ error: 'Problème lors de la suppression du compte' }));
    })
    .catch(error => res.status(500).json({ error:"Problème lié à la base de données" }));
};

