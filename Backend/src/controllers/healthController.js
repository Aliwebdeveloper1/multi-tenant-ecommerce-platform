const mongoose = require('mongoose');

const getHealth = (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
};

const getDBStatus = (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    database: statusMap[dbStatus],
    status: dbStatus === 1 ? 'OK' : 'NOT_CONNECTED',
  });
};

module.exports = {
  getHealth,
  getDBStatus,
};
