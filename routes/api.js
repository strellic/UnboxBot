import User from '../models/User.js';

import helpers from '../src/helpers.js';
import csgoData from '../src/csgoData.js';
import userData from '../src/userData.js';

import fs from 'fs';
import express from 'express';
import bcrypt from 'bcrypt';

let router = express.Router();

const settings 	= JSON.parse(fs.readFileSync("settings.json"));

router.post('/login', (req, res) => {
	let user = req.body.username,
		pass = req.body.password;

	if(user !== settings.admin.user) {
		req.session.error = "Incorrect username or password.";
		return res.redirect("/");
	}

	bcrypt.compare(pass, settings.admin.password, (err, result) => {
		if(err || !result) {
			req.session.error = "Incorrect username or password.";
			return res.redirect("/");
		}

		req.session.authenticated = true;
		return res.redirect("/users");
	});
});

router.get('/logout', (req, res) => {
	req.session = null;
	res.redirect("/");
});

router.post('/money', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id,
		money = parseFloat(parseFloat(req.body.money).toFixed(2));

	if(!id || !money) {
		return res.send("Missing parameters.");
	}

	User.findOneAndUpdate(
		{ id: id },
		{ $set: { money: money }},
		(err, result) => {
			if(err)
				return res.send("There was an error setting money.");
			return res.send("success");
		}
	);	
});

router.post('/rarity', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id,
		rarity = parseInt(req.body.rarity);

	if(!id || !rarity) {
		return res.send("Missing parameters.");
	}

	userData.set(id, "CHEAT_RARITY", rarity);
	res.send("success");
});

router.post('/unbox', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id,
		item = req.body.item,
		float = req.body.float,
		statTrak = parseInt(req.body.statTrak) == 1;

	if(!id || !item) {
		return res.send("Missing parameters.");
	}

	if(!csgoData.items[item.toLowerCase()]){
		return res.send("Could not find item.");
	}

	let unboxItem = csgoData.lowerNameToItem(item);
	unboxItem = csgoData.finishItem(unboxItem);

	let itemCheck = csgoData.items[unboxItem.name.toLowerCase()];

	if(float != "NO" && unboxItem.float) {
		unboxItem.float = helpers.nameToFloat(float);
		if((itemCheck.minFloat/100 || 0) > unboxItem.float || (itemCheck.maxFloat/100 || 1) < unboxItem.float)
			unboxItem = csgoData.finishItem(unboxItem);
	}

	if(itemCheck.stattrak && statTrak)
		unboxItem.statTrak = statTrak;

	unboxItem.price = csgoData.getItemPrice(unboxItem);

	userData.set(id, "CHEAT_UNBOX", unboxItem);
	res.send("success");
});

router.post('/drop', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id,
		item = req.body.item,
		float = req.body.float,
		statTrak = parseInt(req.body.statTrak) == 1;

	if(!id || !item) {
		return res.send("Missing parameters.");
	}

	if(!csgoData.items[item.toLowerCase()]){
		return res.send("Could not find item.");
	}

	let unboxItem = csgoData.lowerNameToItem(item);
	unboxItem = csgoData.finishItem(unboxItem);

	let itemCheck = csgoData.items[unboxItem.name.toLowerCase()];

	if(float != "NO" && unboxItem.float) {
		unboxItem.float = helpers.nameToFloat(float);
		if((itemCheck.minFloat/100 || 0) > unboxItem.float || (itemCheck.maxFloat/100 || 1) < unboxItem.float)
			unboxItem = csgoData.finishItem(unboxItem);
	}

	if(itemCheck.stattrak && statTrak)
		unboxItem.statTrak = statTrak;

	unboxItem.price = csgoData.getItemPrice(unboxItem);

	userData.set(id, "CHEAT_DROP", unboxItem);
	res.send("success");
});

router.post('/crash', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id,
		crash = parseFloat(req.body.crash);

	if(!id || !crash) {
		return res.send("Missing parameters.");
	}

	userData.set(id, "CHEAT_CRASH", crash);
	res.send("success");
});

router.post('/coinflip', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id,
		status = req.body.status;

	if(!id || !status || (status != 'heads' && status != 'tails')) {
		return res.send("Missing parameters.");
	}

	userData.set(id, "CHEAT_COINFLIP", status);
	res.send("success");
});

router.post('/roulette', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id,
		roulette = req.body.roulette;

	if(!id || !["black_2","black_4","black_6","black_8","black_10","black_11","black_13","black_15","black_17","black_20","black_22","black_24","black_26","black_28","black_29","black_31","black_33","black_35","green_0","red_1","red_3","red_5","red_7","red_9","red_12","red_14","red_16","red_18","red_19","red_21","red_23","red_25","red_27","red_30","red_32","red_34","red_36"].includes(roulette)) {
		return res.send("Missing parameters.");
	}

	userData.set(id, "CHEAT_ROULETTE", roulette);
	res.send("success");
});

router.post('/resetDaily', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id;

	if(!id) {
		return res.send("Missing parameters.");
	}

	User.findOneAndUpdate(
		{ id: id },
		{ $set: { lastDaily: 0 }},
		(err, result) => {
			if(err)
				return res.send("There was an error resetting the last daily.");
			return res.send("success");
		}
	);
});

router.post('/resetDrop', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	let id = req.body.id;

	if(!id) {
		return res.send("Missing parameters.");
	}

	User.findOneAndUpdate(
		{ id: id },
		{ $set: { lastDrop: 0 }},
		(err, result) => {
			if(err)
				return res.send("There was an error resetting the last drop.");
			return res.send("success");
		}
	);
});

router.post('/userData', (req, res) => {
	if(!req.session.authenticated) {
		req.session.error = "You must be logged in!";
		return res.redirect("/");
	}

	return res.json(userData.store);
});

export default router;