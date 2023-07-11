const router = require('express').Router();
const { Game } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const newGame = await Game.create({
      name: req.body.title,
      description: req.body.description,
      user_id: req.body.user_id
    });
    res.status(201).json(newGame); 
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const gameData = await Game.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!gameData) {
      res.status(404).json({ message: 'No game found with this id!' });
      return;
    }

    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
