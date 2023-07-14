const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    // TODO: modify session object to include user information and loggedIN boolean
    req.session.save(() => {
      (req.session.userId = newUser.id), (req.session.loggedIn = true);
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
router.get('/profile', async (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/login');
  try {
    const user = await User.findByPk(req.session.userId, {
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
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
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

router.put('/profile', async (req, res) => {
  try {
    const updatedUser = await User.update(req.body, {
      where: {
        id: req.session.userId,
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

router.delete('/profile', async (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/login');
  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.session.userId,
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
router.delete('/:userId', async (req, res) => {
  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.params.userId
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
  console.log('req.body', req.body)
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log('userData', userData)
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      console.log('req.session', req.session)
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
