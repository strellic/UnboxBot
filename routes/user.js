import User from '../models/User.js';
import express from 'express';

let router = express.Router();

router.get('/:id', (req, res) => {
	if(!req.session.authenticated)
		return res.redirect("/");

	let error = req.session.error;

	if(!req.params.id || isNaN(req.params.id)) {
		req.session.error = "Please select a user to view.";
		return res.redirect("/users");
	}

	let id = req.params.id;
	User.findOne({
		id: id
	}, (err, dbUser) => {
		if(err || !dbUser) {
			req.session.error = "There was no user found with that id.";
			return res.redirect("/users");
		}

		res.render("user", {
			error: error,
			title: `${dbUser.username}'s Page`,
			username: dbUser.username,
			avatar: dbUser.avatar,
			money: dbUser.money.toFixed(2)
		});
	})

	req.session.error = null;
})

export default router;