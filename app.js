
const express = require('express');
const app = express();
const ErrorMiddleware = require('./middleware/error')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const fetchAndSaveData  = require('./fetch/fetchAndSaveData')
// setting up config file
dotenv.config({path: './config/config.env'})
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT ;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// database  connectDatabase
const connectDatabase = require('./db/db');
connectDatabase()
app.get('/', (req, res) =>{
    res.send('Welcome to longx')
})

app.set('view engine', 'ejs');

// Specify the directory where your views/templates are located
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors())

app.use(ErrorMiddleware)
//  all Routes 
const auth = require('./routes/auth')
const wallet = require('./routes/wallet')

const userVerification = require('./routes/verification')
const doc = require('./routes/doc')
const uploadRoute = require('./routes/companyVerification');
const person = require('./routes/PersonVerification')
const exchange = require('./routes/ExchangeRoute')
const SendMessage = require('./routes/SendMessageRoute')
// admin authentication 
const adminRoute = require('./routes/admin/AdminAuthRoutes')
const UserDetailsRoute = require('./routes/admin/UserDetailsRoute')
const transactionRoute = require('./routes/transactionRoute/transactionRoute')

app.use('',adminRoute)
app.use('',UserDetailsRoute)


app.use('',transactionRoute)
app.use('',exchange)
app.use('',SendMessage)
app.use('',auth)
app.use('',wallet)
app.use('',userVerification)
app.use('',doc)
app.use('',person)

app.use(uploadRoute);



app.listen(port, () => console.log(`listening on http://localhost:${port}`));
