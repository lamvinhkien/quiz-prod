'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate(models) {
      Quiz.hasMany(models.Question, { foreignKey: 'quizId' })
      Quiz.belongsTo(models.Category)
    }
  }
  Quiz.init({
    name: DataTypes.STRING,
    time: DataTypes.INTEGER,
    numOfCorrect: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Quiz',
    tableName: 'quiz'
  });
  return Quiz;
};