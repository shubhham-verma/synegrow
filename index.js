const express = require('express');
const app = express();
const morgan = require('morgan');

const PORT = 3000;

const sequelize = require('./db');
const taskRoutes = require('./routes/taskRoutes');

app.use(express.json());
app.use(morgan('dev'));
app.use('/api', taskRoutes);

// ✅ Sync database
sequelize.sync().then(() => {
  console.log('SQLite DB synced');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
