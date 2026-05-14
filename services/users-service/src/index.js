require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users.routes');

const app = express();
const PORT = process.env.USERS_SERVICE_PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'users-service', status: 'running', timestamp: new Date().toISOString() });
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`[Users Service] Corriendo en puerto ${PORT}`));
module.exports = app;
