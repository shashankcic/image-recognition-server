const handleSignin = ((db,bcrypt,saltRounds)=>(req,res)=>{
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

module.exports = {
	handleSignin: handleSignin
}