import Discord from 'discord.js';
import fs from 'fs';

import csgoData from './src/csgoData.js';

const settings 		= JSON.parse(fs.readFileSync("settings.json"));

const client 		= new Discord.Client();
client.commands 	= new Discord.Collection();
client.events	 	= new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if (err) 
		return console.log(err);

	files.forEach(async file =>{
		if (!file.endsWith(".js")) 
			return;

		let props = await import(`./commands/${file}`);
		let commandName = file.split(".")[0];
		props.default.name = commandName;
		client.commands.set(commandName, props);
	});
});

fs.readdir('./events/', (err, files) => {
	if (err)
		console.log(err);

	files.forEach(async file => {
		let eventFunc = await import(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, (...args) => {
			eventFunc.default.run(client, ...args);
		});
	});
});

client.on('ready', () => {
	console.log(`[BOT] Logged in as ${client.user.tag}!`);
	client.user.setActivity(`${settings.prefix}help`);
});

client.login(settings.token);