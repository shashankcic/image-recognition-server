const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'Shashank',
    password : '123',
    database : 'facerecognition'
  }
});

const saltRounds = 10;
// const myPlaintextPassword = 'bacon';
// const someOtherPlaintextPassword = 'not_bacon';

const app = express();

app.use(bodyParser.json());
app.use(cors());
// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'John',
// 			email: 'john@gmail.com',
// 			password: 'cookies',
// 			entries:0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '124',
// 			name: 'Sally',
// 			email: 'sally@gmail.com',
// 			password: 'bananas',
// 			entries:0,
// 			joined: new Date()		
// 		}
// 	],
// 	login: [
// 		{
// 			id: '987',
// 			hash: '',
// 			email: 'john@gmail.com'
// 		}
// 	]
// }

app.get('/',(req,res)=>{	
	res.send(database.users);
})

app.post('/signin',(req,res)=>{
	db.select('email','hash').from('login')
		.where('email', '=', req.body.email)
		.then(data=> {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid){
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user=> {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to egt user'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))

	// // // Load hash from your password DB.
	// // bcrypt.compare('apples', '$2b$10$bC5uR8yWWj.g3ZW1socaY.H.PuiAcnB0HD.Sl0HJVj1gYmtKICm/i', function(err, res) {
	// //     console.log('first guess',res);
	// //     // res == true
	// // });
	// // bcrypt.compare("veggies", "$2b$10$RptN6TLzqoUhgpnFg2yV8eciifxbUkmuDAOjLxFI0KS/yVIws/p.m", function(err, res) {
	// //     console.log("second guess",res)
	// //     // res == false
	// // });
	// if(req.body.email=== database.users[0].email 
	// 	&& req.body.password=== database.users[0].password){
	// 	res.json(database.users[0]);
	// }else {
	// 	res.status(400).json('error logging in');
	// }
})

app.post('/register',(req,res)=>{
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password,saltRounds);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email:loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
	// database.users.push({
	// 	id: '125',
	// 	name: name,
	// 	email: email,
	// 	entries:0,
	// 	joined: new Date()
	// })
	// bcrypt.genSalt(saltRounds, function(err, salt) {
 //    	bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
 //        	// Store hash in your password DB.
 //    	});
	// });
	// res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req, res)=> {
	const {id} = req.params;
	// let found =false;
	db.select('*').from('users').where({
		id: id
	}).then(user => {
		if(user.length){
			res.json(user[0])
		}else {
			res.status(400).json("not found")		
		}
	})
	.catch(err => res.status(400).json("error getting user"))	
	// database.users.forEach(user =>{
	// 	if(user.id===id){
	// 		found = false;
	// 		return res.json(user);
	// 	}
	// })
	// if(!found){
	// 	res.status(404).json('no such user');
	// }
})

app.put('/image',(req,res) =>{
	const {id} = req.body;
	db('users').where('id','=',id)
		.increment('entries',1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json("unable to get entries"))

	// let found =false;
	// database.users.forEach(user =>{
	// 	if(user.id===id){
	// 		found=true;
	// 		user.entries++
	// 		return res.json(user.entries);
	// 	}
	// if(!found){
	// 	res.status(404).json('no such user');
	// }
})


app.listen(3000,()=>{
	console.log('app is running on the port 3000');
})