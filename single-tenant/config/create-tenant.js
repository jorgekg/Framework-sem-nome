const Sequelize = require('sequelize');
const readline = require('readline');
const { v4 } = require('uuid');

const env = process.env.NODE_ENV || 'development';
const config = require('./default-config.json')[env];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sequelize = new Sequelize(config.database, config.username, config.password, config);

rl.question("Qual é o nome do tenant?", async (name) => {
  try {
    await sequelize.createSchema(name);
    await sequelize.query(`INSERT INTO public.client VALUES($1, $2, $3, $4)`, {
      bind: [v4(), name, new Date(), new Date()]
    });
    await sequelize.close();
  } catch (err) {
    console.log(err);
  }
  rl.close();
});