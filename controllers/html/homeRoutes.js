const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Game, GameSession, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all games and JOIN with user data
    const gameData = await Game.findAll({
      include: [
        {
          model: GameSession,
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ]
        },
        
      ],
    });

    // Serialize data so the template can read it
    const games = gameData.map((game) => game.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      games, 
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/game/:id', async (req, res) => {
  try {
    const gameData = await Game.findByPk(req.params.id, {
      include: [
        {
          model: GameSession,
          include: [
            {
              model: User,
              attributes: ['username'],
            }
          ]
        },
      ],
    });

    const game = gameData.get({ plain: true });

    res.render('game', {
      ...game,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// Use withAuth middleware to prevent access to route
router.get('/profile', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: GameSession, include: [{ model: User }] }],
    });
    const user = userData.get({ plain: true });
    res.render('profile', {loggedIn: req.session.loggedIn});
    // , {
    // //   user,
    // //   loggedIn: true
    // // });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
