const router = require('express').Router();
const { Game, User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const newGame = await Game.create({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json(newGame); 
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/', async (req,res) => {
  try {
    const games = await Game.findAll({
    });
    res.status(200).json(games);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.gameId, {
    });

    if (!game) return res.status(404).json({message: 'No game found.'});

    res.status(200).json(game)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put('/:gameId', async (req, res) => {
  try {
    const updatedGame = await Game.update(req.body, {
      where: {
        id: req.params.gameId,
      },
      individualHooks: true,
    });
    
    if (!updatedGame[0]) return res.status(404).json({message: 'No game found.'});

    res.status(202).json(updatedGame);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.delete('/:gameId', async (req, res) => {
  try {
    const deletedGame = await Game.destroy({
      where: {
        id: req.params.gameId
      },
    });

    if (!deletedGame) return res.status(404).json({message: 'No game found.'});
    
    res.status(202).json(deletedGame);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

module.exports = router;
