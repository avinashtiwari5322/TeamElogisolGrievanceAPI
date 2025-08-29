require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./src/interface/db');
const healthRoute = require('./routes/health');
const authRoute = require('./routes/auth');
const masterRoute = require('./routes/master');
const requestRoute = require('./routes/request');
const requestFetchRoute = require('./routes/requestFetch');
const requestDetailRoute = require('./routes/requestDetail');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/master', masterRoute);
app.use('/api/request', requestRoute);
app.use('/api/request-fetch', requestFetchRoute);
app.use('/api/request-detail', requestDetailRoute);

connectToDatabase();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
