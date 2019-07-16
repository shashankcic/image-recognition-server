const handleProfileGet = ((req, res, db)=> {
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

module.exports = {
	handleProfileGet: handleProfileGet
}