'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    Comment.belongTo(models.Restaurant)
    Comment.belongTo(models.User)
  };
  return Comment;
};