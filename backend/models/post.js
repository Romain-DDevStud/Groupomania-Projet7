'use strict';

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
        "Post",
        {
            title: DataTypes.STRING,
            content: DataTypes.STRING,
            attachement: DataTypes.STRING,
            userId: DataTypes.STRING,
        },
        {}
    );
    Post.associate = function (models) {
        Post.belongsTo(models.User); //plusieurs messages peuvent-être lié à un user
        Post.hasMany(models.Comment, { 
            foreignKey: "postId", 
            onDelete: "CASCADE" 
        });         
    };
    return Post;
};