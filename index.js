const   express = require('express'),
        socketio = require('socket.io'),
        http = require('http'),
        dotenv = require('dotenv').config(),
        bodyParser = require('body-parser'),
        cors = require('cors');

const app = express();

const corsOptions = {
    origin:process.env.FRONTEND_ENDPOINT,
    optionsSuccessStatus:200
}

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(require('./routes'));

const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;



server.listen(PORT,()=>{
    console.log(`Server ready listen ${PORT}`);
})