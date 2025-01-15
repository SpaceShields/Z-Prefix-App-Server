const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// This controller function will find items in the db associated with the currently logged-in user
exports.readItemsByUser = async (req, res) => {
    try {
      
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
}

exports.readItems = async (req, res ) => {
    try {
        const items = await prisma.item.findMany();
        if(items == null) return res.status(404).json({ error: 'No items found' });
        return res.status(200).json(items);

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