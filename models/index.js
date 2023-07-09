const User = require('./User');
const Game = require('./Game');
const GameSession = require('./GameSession');

// There is a many-to-many relationship between User and Game that can be modelled via the GameSession junction model, like so:

// a user can have many game-sessions
User.hasMany(GameSession, {
  foreignKey: 'user_id',
});

GameSession.belongsTo( User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

// a game can be chosen in many game-sessions
Game.hasMany(GameSession, {
  foreignKey: 'game_id',
});

GameSession.belongsTo(Game, {
  foreignKey: 'game_id',
  onDelete: 'CASCADE',
});

module.exports = { User, Game, GameSession };
