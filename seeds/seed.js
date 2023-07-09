const sequelize = require('../config/connection');
const { User, Game, GameSession } = require('../models');

const userData = require('./userData.json');
const gameData = require('./gameData.json');
// const gameSessionData = require('./gameSessionData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const games = await Game.bulkCreate(gameData, {
    returning: true,
  });

  // create 10 game sessions
  for (let i = 0; i < 10; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomGameIndex = Math.floor(Math.random() * games.length);
    await GameSession.create({
      user_id: users[randomUserIndex].id,
      game_id: games[randomGameIndex].id,
    });
  }

  console.log('\n********** All seeded!! **********\n');
  process.exit(0);
};

seedDatabase();
