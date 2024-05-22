const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');


//db
const sequelize = require('./utils/db');
// confing env
const path = './config.env'
require('dotenv').config({path:path});


// initialize app
const app = express();


const corsOptions = {
    origin: 'http://localhost:3001', // Sadece React uygulamasının URL'si
    optionsSuccessStatus: 200, // İsteğin başarı durumu
    credentials: true, // Kimlik bilgilerini kabul et
  };

app.use(cors(corsOptions)); // CORS ayarlarını kullan

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//cookie parser
app.use(cookieParser());






//ROUTES
const authRouter = require('./routes/auth-route');
const companyRouter = require('./routes/companyRoute');
const coordinatorRouter = require('./routes/coordinator-route');
const secretariatRouter = require('./routes/secretariat-route');



app.use('/ims/auth-service/api',authRouter);
app.use('/ims/auth-service/api/coordinator', coordinatorRouter);
app.use('/ims/auth-service/api/company', companyRouter);
app.use('/ims/auth-service/api/secretariat', secretariatRouter);

// cookie token test
const { authenticate } = require('./middleware/authenticate');
app.use('/ims/auth-service/api/test',authenticate,async(req,res) =>{
    //console.log(req.user);
    res.json({
        access:true,
        
    });
})


//404 not found
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})







// connect to port
sequelize
    .sync()
    .then(result => {
        console.log("Database connected");
        app.listen(process.env.PORT);
        console.log(process.env.PORT)
    })
    .catch(err => console.log(err,'error handle'));