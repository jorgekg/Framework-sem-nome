'use strict';
module.exports = {
  up: async (queryInterface, schema, DataTypes) => {
    await queryInterface.createTable('user', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      schema: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'schemas', key: 'id' }
      },
      name: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      schema: schema
    });
  }
};