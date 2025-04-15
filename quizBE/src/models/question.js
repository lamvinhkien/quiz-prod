'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Quiz)
      Question.hasMany(models.Answer, { foreignKey: 'questionId' })
    }
  }
  Question.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    failedPoint: DataTypes.BOOLEAN,
    quizId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'question'
  });
  return Question;
};