'use strict';

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        "Comment",
        {
            postId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            content: DataTypes.STRING,
        },
        {}
    );
    Comment.associate = function (models) {
        Comment.belongsTo(models.User, {
            foreignKey: "userId",
        }); 
        Comment.belongsTo(models.Post, {
            //plusieurs commentaires peuvent-être lié à un user
            foreignKey: "postId",
            onDelete: "CASCADE", 
        });
    };
    return Comment;
}; 