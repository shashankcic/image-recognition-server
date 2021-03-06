const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile');
const image = require('./controllers/image.js')
const config =require('./config_keys');

const connection=config.credentials

const db = knex({
  client: 'pg',
  connection: connection
});

const saltRounds = 10;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{res.send(database.users)})
app.post('/signin',signin.handleSignin(db,bcrypt,saltRounds)) //works the same way as the ones given below, the syntax has changed accordingly in the signin file
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt,saltRounds)})
app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req,res,db)} )
app.put('/image', (req,res) => {image.handleImage(req,res,db)})
app.post('/imageurl', (req,res) => {image.handleApiCall(req,res)})

app.listen(3000,()=>{
	console.log('app is running on the port 3000');
})