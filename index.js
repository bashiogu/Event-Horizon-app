const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');

require('dotenv').config();

const app = express();
const userRoutes = require('./routes/user.routes');

const PORT = process.env.PORT || 9090;

app.use(express.json());
app.use(morgan('dev'));


connectDB();


app.get('/', (req, res) => {
    res.send('Hello Browny');
});


app.use('/api/v1/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is connected to port ${PORT}`);
});