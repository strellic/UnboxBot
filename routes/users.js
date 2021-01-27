import User from '../models/User.js';
import express from 'express';

let router = express.Router();

router.get('/', (req, res) => {
	if(!req.session.authenticated)
		return res.redirect("/");

	let error = req.session.error;

	User.find({}, (err, dbUsers) => {
		let users = [];

		for(let i = 0; i < dbUsers.length; i++) {
			let dbUser = dbUsers[i];
			let avatar = "/assets/unknown.png";

			if(dbUser.avatar && dbUser.avatar !== "UNKNOWN")
				avatar = dbUser.avatar;

			users.push({
				avatar: avatar,
				username: dbUser.username,
				id: dbUser.id,
				money: dbUser.money.toFixed(2)
			});
		}

		res.render("users", {title: "Users", users: users, error: error});
	});

	req.session.error = null;
})

export default router;