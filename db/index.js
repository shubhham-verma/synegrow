const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: './db/tasks.sqlite'
})

module.exports = sequelize;