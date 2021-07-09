const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const PORT = process.env.PORT || config.get('port_exp');
const port = process.env.PORT || config.get('port_io');
const mongoDB = config.get('mongoUrl');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const io = require("socket.io")(port, {
    cors: {
        origin: "http://localhost:3000",
    },
});
const authRoute = require('./routes/auth.route');
const profileRoute = require('./routes/profile.route');


mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log('MongoDB подключен...'))
    .catch(error => console.log(error))

const app = express();

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors({
    origin: true
}));

app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);

require("./socetIo")(io);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
});