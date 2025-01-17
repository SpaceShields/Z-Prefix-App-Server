const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// This is a prisma client extension that catches any create or update operations for a user
// This query will catch those operations and use bcrypt to hash the password
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      $allOperations({ operation, args, query }) {
        if (['create', 'update'].includes(operation) && args.data['password']) {
          args.data['password'] = bcrypt.hashSync(args.data['password'], 10)
        }
        return query(args)
      }
    }
  }
});


// This controller function will use bcrypt to check the password against the hash password in the db
// Then it will return an accessToken as a signed JWT
exports.loginUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
          username: req.body.username
      }
    });

    const match = await bcrypt.compare(req.body.password, user.password);

    if(match) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      console.log(`${user.username} logged in`);
      return res.status(202).json({ accessToken: accessToken });
    }

    return res.status(400).json({ error: 'Password is incorrect' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// This controller function creates a new user, hashes the password
// and returns the user data minus the password hash
exports.createUser = async (req, res) => {
    try {
        if(!req.body.username) {
            return res.status(422).json({ error: 'Username is required' });
        }

        if(await prisma.user.findUnique({where: { username: req.body.username }})) {
          return res.status(409).json({ error: `${req.body.username} username already exists!` })
        }

        const newUser = await prisma.user.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: req.body.password
            }
        });

        return res.status(201).json({
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username 
        })
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}