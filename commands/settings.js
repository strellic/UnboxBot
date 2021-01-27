import fs from 'fs';
import helpers from '../src/helpers.js';
import ServerSettings from '../models/ServerSettings.js';

const settings = JSON.parse(fs.readFileSync("settings.json"));

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	let keys = [
		{key: 'prefix', default: settings.prefix}
	];

	if(args.length < 2) {
		let embed = helpers.embed()
		.setTitle("Settings")
		.setFooter(`${prefix}settings [setting] [new value]`);

		let server = await ServerSettings.findOne({
			id: msg.channel.id
		});

		let fields = [];
		keys.forEach(key => {
			let field = {
				name: key.key
			}
			if(server && server[key.key])
				field.value = `value: ${server[key.key]}`;
			else {
				field.value = `value: ${key.default || "NONE"}`;
			}

			fields.push(field);
		});

		embed.addFields(...fields);
		return msg.channel.send(embed);
	}
	else {
		if(!helpers.isAdmin(msg.member)) {
			return msg.reply("you are not an admin!");
		}

		let keyName = args[0], newValue = args[1];
		if(!keys.some(key => key.key == keyName)) {
			return msg.reply(`setting **${keyName}** not found.`);
		}

		let server = await ServerSettings.findOne({
			id: msg.channel.id
		});
		if(!server) {
			server = await new ServerSettings({
				id: msg.channel.id
		    });
		    await server.save();
		}

		server[keyName] = newValue;
		server.save();

		return msg.reply(`setting **${keyName}** changed to **${newValue}**.`);
	}
}

exports.help = "Change settings for the bot.";

export default exports;