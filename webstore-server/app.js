const express = require('express');
const app = express()
const path = require('path')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const db = require('./app/models')
require('dotenv').config();
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: db.url,
        collectionName: 'sessions',
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    }
  }))
app.use(function(req, res, next) { 
    res.header("Access-Control-Allow-Origin", process.env.FRONT_END_URL); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); 
    res.header("Access-Control-Allow-Credentials", "true");
    next(); 
});

app.use('/img', express.static(path.join(__dirname, './public/img')))

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then((result) => {
        console.log('Database connected!')
    }).catch((err) => {
        console.log("Cannot connect to database!", err)
        process.exit()
    })

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to vuestore-server"
    })
})

app.get('/api/check-session', (req, res) => {
    if (req.session && req.session.user_id) {
        res.json({ authenticated: true, role: req.session.role });
    } else {
      res.json({ authenticated: false });
    }
  });
  

require('./app/routes/product.route')(app)
require('./app/routes/order.route')(app)
require('./app/routes/user.route')(app)
require('./app/routes/category.route')(app)


app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
