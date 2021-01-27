import findRemoveSync from 'find-remove';
import mongoose	from "mongoose";
import path	from "path";
import fs from "fs";

import csgoData	from "./src/csgoData.js";

const settings = JSON.parse(fs.readFileSync("settings.json"));

let load = async () => {
	await mongoose.connect(settings.mongo, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	mongoose.set('useFindAndModify', false);
	
	console.log('[BOT] Database connection successful!');

	findRemoveSync(path.resolve(path.resolve(), './public/temp/'), {age: {seconds: 1}, files: "*.*"});

	await csgoData.init();

	setInterval(() => {
		csgoData.init();
	}, 60*60*1000);
	setInterval(() => {
		console.log(`[WEB] Cleaning up temp directory...`);
		findRemoveSync(path.resolve(path.resolve(), './public/temp/'), {age: {seconds: 3600}, files: "*.*"});
	}, 10*60*1000);

	await import(`./web.js`);
	await import(`./bot.js`);
}
load();