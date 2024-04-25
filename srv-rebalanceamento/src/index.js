'use strict';

// fs = require('fs'),
// swaggerTools = require('swagger-tools'),
// express = require('express'),
// jsyaml = require('js-yaml'),
// config = require('./config/system-life'),

var 
    path = require('path'),
    http = require('http'),
    mongoose = require('mongoose'),
    NodeHog = require('nodehog'),
    cors = require('cors');
    
var corsOrigin = process.env.CORS || "http://localhost:4200";
var corsOptions = {
    origin: corsOrigin
};
console.log(`Cors Origin: ${corsOrigin}`);
    

var oas3Tools = require('oas3-tools');
var serverPort = parseInt(process.env.SERVER_PORT) || 4201;

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers'),
        swaggerUi: path.join(__dirname, '/swagger.json'),
        useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();
app.disable('x-powered-by');
app.use(cors(corsOptions));
// parse requests of content-type - application/json
// app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

const serverStatus = () => {
    return {
        state: 'up',
        dbState: mongoose.STATES[mongoose.connection.readyState]
    }
};

app.get('/health', (res, req) => {
    let healthResult = serverStatus();
    if (mongoose.connection.readyState == 0) {
        req.statusCode = 500;
        req.send('down');
    } else {
        req.json(healthResult);
    }
});

app.get('/', (res, req) => {
    console.log("Bem vindo!");
    req.json({"grettings": "Bem vindo!"});
})

app.get('/stress/:elemento/tempostress/:tempoStress/tempofolga/:tempoFolga/ciclos/:ciclos', (req, res) => {

    const elemento = req.params.elemento;
    const tempoStress = req.params.tempoStress * 1000;
    const tempoFolga = req.params.tempoFolga * 1000;
    const ciclos = req.params.ciclos;
    new NodeHog(elemento, tempoStress, tempoFolga, ciclos).start();
    res.send("OK");
});


// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);

});

var mongoURI = process.env.MONGODB_URI || 'mongodb://user:pass@localhost:27017/rebalanceamento?retryWrites=true&w=majority'; // 'mongodb://mongouserdb:mongopwd@localhost:27017/admin';
    
console.log(`Usando conexão com ${mongoURI}`);
mongoose.Promise = global.Promise;

var connectWithRetry = async() => {
    const options = { 
        "authSource": "admin",
        "useNewUrlParser": true };

    try {
        mongoose.set('strictQuery', false)
        // mongoose.connect(mongoURI) 
        mongoose.createConnection(mongoURI, options) 
        console.log('Mongo connected')
    }
    catch(error) {
        console.error(`${new Date().toLocaleString()} Failed to connect to mongo on startup - retrying in 5 sec`, error);
        setTimeout(connectWithRetry, 5000);
//        process.exit()
    }
};

connectWithRetry();


