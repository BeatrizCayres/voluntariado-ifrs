const express = require('express');
const { specs, swaggerUi } = require('./config/swagger');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const eventsRoutes = require('./routes/events.routes');
const volunteersRoutes = require('./routes/volunteers.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Middlewares globais.
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.sendStatus(204);
});

app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/volunteers', volunteersRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

module.exports = app;
