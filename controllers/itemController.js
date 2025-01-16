const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// This controller function will find items in the db associated with the currently logged-in user
exports.readItemsByUser = async (req, res) => {
    try {
      // Verify the token and extract the user information
      const authHeader = req.headers['authorization'];
      if(authHeader == undefined) return res.status(401).json({ error: 'Unauthorized' });
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) return res.status(401).json({ error: 'Unauthorized' });
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if(err) return res.status(403);
          req.user = user;
          console.log(`${user.username} was verified`);
      });

      if(req.user == undefined) {
          return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Read all items with the corresponding ID
      const items = await prisma.item.findMany({
        where: {
            userId: req.user.id
        }
      });
        if(items.length == 0) return res.status(404).json({ error: 'No items found' });
        return res.status(200).json(items);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
}

// This controller function will find all items in the db
// Each item will also include the id and username of the respective inventory manager
exports.readItems = async (req, res ) => {
    try {
        const items = await prisma.item.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            }
        });
        if(items.length == 0) return res.status(404).json({ error: 'No items found' });
        return res.status(200).json(items);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// This controller function will retrieve the item details from an id param
exports.readItemById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const item = await prisma.item.findUnique({
            where: {
                id: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            }
        });

        if(item == null) return res.status(404).json({ error: 'Item not found' });

        return res.status(200).json(item);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// This controller function will create a new item after validating the accessToken
exports.createItem = async (req, res) => {
    try {
        // Simple error catching for form validation
        if (!req.body.itemName) return res.status(422).json({ error: 'Item name is required' });
        if (!req.body.quantity) {
         return res.status(422).json({ error: 'Quantity is required' });
        } else {
            if (typeof req.body.quantity !== 'number' || req.body.quantity < 1) {
                return res.status(422).json({ error: 'Quantity must be a non-negative and non-zero number' });
            }
        }

        // Verify the token and extract the user information
        const authHeader = req.headers['authorization'];
        if(authHeader == undefined) return res.status(401).json({ error: 'Unauthorized' });
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.status(401).json({ error: 'Unauthorized' });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403);
            req.user = user;
            console.log(`${user.username} was verified`);
        });

        if(req.user == undefined) {
            return res.status(401).json({ error: 'Unauthorized' });
        } 

        // Create the item in the db using prisma
        const newItem = await prisma.item.create({
            data: {
                userId: req.user.id,
                itemName: req.body.itemName,
                description: req.body.description,
                quantity: req.body.quantity
            }
        });

        // log the new item
        console.log(`New Item (${newItem.itemName}) created by ${req.user.username}`);

        // Set the response with new item data
        return res.status(201).json(newItem);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// This controller function will verify the user and the item userId
// then it will update the item with the respective fields
exports.updateItem = async (req, res) => {
    try {
        
        if(req.body.itemName !== undefined && req.body.itemName.trim() === '') {
            return res.status(422).json({ error: 'Item name cannot be empty' });
        }

        if(req.body.quantity !== undefined && (typeof req.body.quantity !== 'number') || req.body.quantity < 1){
            return res.status(422).json({ error: 'Quantity must be a non-zero and non-negative number' });
        }

        // Verify the token and extract the user information
        const authHeader = req.headers['authorization'];
        if(authHeader == undefined) return res.status(401).json({ error: 'Unauthorized' });
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.status(401).json({ error: 'Unauthorized' });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403);
            req.user = user;
            console.log(`${user.username} was verified`);
        });

        if(req.user == undefined) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const oldItem = await prisma.item.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if(oldItem.userId != req.user.id){
            return res.status(401).json({ error: 'Unauthorized update' });
        }
        
        const updatedItem = await prisma.item.update({
            data: {
                userId: req.user.id,
                itemName: req.body.itemName,
                description: req.body.description,
                quantity: req.body.quantity
            },
            where: {
                id: parseInt(req.params.id)
            }
        });

        return res.status(200).json(updatedItem);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// This function will verify the user and delete the requested item from the db
exports.deleteItem = async (req, res) => {
    try {
        // Verify the token and extract the user information
        const authHeader = req.headers['authorization'];
        if(authHeader == undefined) return res.status(401).json({ error: 'Unauthorized' });
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.status(401).json({ error: 'Unauthorized' });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403);
            req.user = user;
            console.log(`${user.username} was verified`);
        });

        if(req.user == undefined) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const oldItem = await prisma.item.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if(oldItem.userId != req.user.id){
            return res.status(401).json({ error: 'Unauthorized delete' });
        }

        await prisma.item.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });

        return res.status(202).json({ message: 'Item deleted successfully' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}