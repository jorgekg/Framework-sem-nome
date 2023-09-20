const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./default-config.json');

const migrate = async () => {
  const sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, config[env]);
  const tenants = ['public'];
  for (let i = 0; i < tenants.length; i++) {
    console.log(`Migrating schema public...`);
    config[env].migrationStorageTableSchema = 'public';
    try {
      const save = new Promise((resolve, reject) => {
        fs.writeFile('./config/config.json', JSON.stringify(config), err => {
          if (err) {
            console.log(err);
            reject()
          } else {
            resolve();
          }
        });
      });
      await save;
      const { stdout, stderr } = await exec('npx sequelize-cli db:migrate');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr)
      console.log(`Migrate schema public concluded.`);
      sequelize.close();
    } catch (err) {
      console.log(err);
    }
  }
}

migrate();