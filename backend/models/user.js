'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User", 
        {
            email: DataTypes.STRING,
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            isAdmin: DataTypes.BOOLEAN,
            attachementuser: DataTypes.STRING,
        },
        {}
    );
    User.associate = function (models) {
        User.hasMany(models.Post, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });
        User.hasMany(models.Comment, {
            foreignKey: "userId",
            onDelete: "CASCADE"
        });
    };
    return User;
};