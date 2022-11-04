require('dotenv').config();
process.env.TZ = 'Asia/Calcutta'
const express = require('express');
var cors = require('cors')
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors())
app.set('trust proxy', 1);

const uploadRoute = require('./routes/v1/upload');
app.use('/v1', uploadRoute);

const menuRoute = require('./routes/v1/menu');
app.use('/v1/menu', menuRoute);

const server = app.listen(
  PORT,
  () => console.log(`Upload service is running on port : ${PORT}`)
)