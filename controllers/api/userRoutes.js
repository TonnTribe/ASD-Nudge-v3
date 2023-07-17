const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    // TODO: modify session object to include user information and loggedIN boolean
    req.session.save(() => {
      (req.session.user_id = newUser.id), (req.session.loggedIn = true);
      res.status(201).json(newUser);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// TODO: ICEBOX - Admin routes
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Route to retrieve logged in user's profile
router.get('/profile', withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) return res.status(404).json({message: 'No user found.'});

    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// TODO: ICEBOX - Admin routes
router.get('/:user_id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) return res.status(404).json({message: 'No user found.'});

    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put('/profile', withAuth, async (req, res) => {
  try {
    const updatedUser = await User.update(req.body, {
      where: {
        id: req.session.user_id,
      },
      individualHooks: true,
    });
    
    if (!updatedUser[0]) return res.status(404).json({message: 'No user found.'});

    res.status(202).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.delete('/profile', withAuth, async (req, res) => {
  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.session.user_id,
      },
    });

    if (!deletedUser) return res.status(404).json({message: 'No user found.'});
    
    res.status(202).json(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

// TODO: ICEBOX - Admin routes
router.delete('/:user_id', async (req, res) => {
  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.params.user_id
      },
    });
    console.log(deletedUser);

    if (!deletedUser) return res.status(404).json({message: 'No user found.'});
    
    res.status(202).json(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res
        .status(400)
        .json({ message: 'Incorrect email, please try again' });
      return;
    }

    const validPassword = await user.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.loggedIn = true;
      res.json({ user: user, message: 'You are now logged in!' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  };
});

router.post('/logout', async (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
