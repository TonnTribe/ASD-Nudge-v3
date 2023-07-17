const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GameSession extends Model {}

GameSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        game_id: {
            type: DataTypes.INTEGER,
            unique: false,
            references: {
                model: 'game',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'game_session',
    }
);

module.exports = GameSession;