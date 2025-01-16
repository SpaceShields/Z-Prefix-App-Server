const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');


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

async function main() {

  // User data
   const users = [
    {
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'alice123',
      password: 'password123',
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      username: 'bobbyJ',
      password: 'securepassword',
    },
    {
      firstName: 'Charlie',
      lastName: 'Brown',
      username: 'charlie_b',
      password: 'mypassword',
    },
    {
      firstName: "Diana",
      lastName: "Miller",
      username: "diana_m",
      password: "password789"
    },
  ];

    // Seed Users with password hashing over a for-loop
    for (let i = 0; i < users.length; i++) {
      await prisma.user.create({
        data: {
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        username: users[i].username,
        password: users[i].password
    }});
    };
  
    console.log(`${users.length} users created.`);

    // Retrieve users for foreign key IDs
    const allUsers = await prisma.user.findMany();
  
    // Seed Items
    const items = await prisma.item.createMany({
      data: 
        [
          {
            itemName: "Laptop",
            userId: allUsers[0].id,
            description: "A powerful gaming laptop",
            quantity: 10,
          },
          {
            itemName: "Notebook",
            userId: allUsers[1].id,
            description: "A lined notebook for notes",
            quantity: 5,
          },
          {
            itemName: "Smartphone",
            userId: allUsers[2].id,
            description: "A latest-gen smartphone",
            quantity: 2,
          },
          {
            itemName: "Headphones",
            userId: allUsers[3].id,
            description: "Noise-canceling headphones",
            quantity: 1,
          },
          {
            itemName: "Tablet",
            userId: allUsers[0].id,
            description: "A lightweight tablet for reading and browsing",
            quantity: 3,
          },
          {
            itemName: "Desk Chair",
            userId: allUsers[1].id,
            description: "Ergonomic desk chair for office work",
            quantity: 1,
          },
          {
            itemName: "Keyboard",
            userId: allUsers[2].id,
            description: "Mechanical keyboard with RGB lighting",
            quantity: 1,
          },
          {
            itemName: "Water Bottle",
            userId: allUsers[3].id,
            description: "Reusable stainless steel water bottle",
            quantity: 4,
          },
          {
            itemName: "Backpack",
            userId: allUsers[0].id,
            description: "Spacious backpack for travel and daily use",
            quantity: 2,
          },
          {
            itemName: "Monitor",
            userId: allUsers[1].id,
            description: "4K Ultra HD monitor for productivity",
            quantity: 1,
          },
        ]
    });
  
    console.log(`${items.count} items created.`);
  }
  
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });