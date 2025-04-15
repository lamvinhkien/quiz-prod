'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      Answer.belongsTo(models.Question)
    }
  }
  Answer.init({
    correctAnswer: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    questionId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Answer',
    tableName: 'answer'
  });
  return Answer;
};