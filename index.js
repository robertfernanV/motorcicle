const   express = require('express'),
        socketio = require('socket.io'),
        http = require('http'),
        dotenv = require('dotenv').config(),
        bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.json());
app.use(require('./routes'));

const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;



server.listen(PORT,()=>{
    console.log(`Server ready listen ${PORT}`);
})