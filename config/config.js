require('dotenv').config();

const { PORT } = process.env;

const config = {
  env: {
    PORT
  }
};

module.exports = {
  config
};
