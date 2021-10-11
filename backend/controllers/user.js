require('dotenv').config();
const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');
const database = require('../utils/database');
const { getCommentsOfEachPosts, getLikesOfEachPosts } = require('./post');

/* Ajout d'un nouvel utilisateur */
exports.newuser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const connection = database.connect();
        // Cryptage et échappement SQL des données utilisateurs
        const name = req.body.name;
        const email = req.body.email;
        const password = cryptojs.AES.encrypt(hash, process.env.CRYPT_USER_INFO).toString();
        let isAdmin;
        // Requete SQL préliminaire. But: s'il n'y a pas encore d'utilisateur, le premier User créé sera administrateur.
        const preliminarySql = "SELECT COUNT(*) AS numberOfUsers FROM Users;";
        connection.query(preliminarySql, (error, result, fields) => {
            if (error) {
            console.log(error);
            connection.end();
            res.status(500).json({ "error": error.sqlMessage });
            } else {
                console.log(result);
                if (result[0].numberOfUsers === 0) {
                    isAdmin = 1;
                } else {
                    isAdmin = 0;
                }
                // Requete SQL principale
                const sql = "\
                INSERT INTO Users (name, email, password, isadmin)\
                VALUES (?, ?, ?, ?);";
                const sqlParams = [name, email, password, isAdmin];
                // Envoi de la requete et réponse au frontend en fonction des erreurs SQL
                connection.execute(sql, sqlParams, (error, results, fields) => {
                    if (error) {
                        if (error.errno === 1062) { // ERREUR : email déjà utilisé dans la base
                        res.status(403).json({ "error": "L'email est déjà utilisé !" });
                        } else { // Autre erreur SQL
                            res.status(500).json({ "error": error.sqlMessage });
                        }
                    } else { // Pas d'erreur : utilisateur ajouté
                        res.status(201).json({ message: 'Utilisateur créé' });
                    }
                });
                connection.end();
            }
        });
    })
    .catch(error => res.status(500).json({ error }));
}
        

