// Import routes
const dressRoutes = require('./routes/dressRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Use routes
app.use('/api', dressRoutes);
app.use('/api', userRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', reviewRoutes); 