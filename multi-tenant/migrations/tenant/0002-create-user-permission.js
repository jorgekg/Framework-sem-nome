'use strict';
module.exports = {
  up: async (queryInterface, schema, DataTypes) => {
    await queryInterface.createTable('user_permission', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      feature: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      viewer: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      created: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      updated: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      deleted: {
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