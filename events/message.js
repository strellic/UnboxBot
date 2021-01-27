import fs from 'fs';
import ServerSettings from '../models/ServerSettings.js';

const settings = JSON.parse(fs.readFileSync("settings.json"));

let exports = {};

exports.run = async(client, msg) => {
	if (msg.author.bot || msg.channel.type === "dm")
		return;

	let prefix = settings.prefix;

	let server = await ServerSettings.findOne({
		id: msg.channel.id
	});

	if(server && server.prefix)
		prefix = server.prefix;

	//if(msg.mentions.has(client.user)) {
	//	msg.reply(`hello! You can use my help menu with the command: **${prefix}help**`);
	//}

	if(msg.content.startsWith(prefix)) {
		let messageArray = msg.content.split(" ");

	    let cmd = messageArray[0],
	    	args = messageArray.slice(1).filter(x => x.length),
	    	commandfile = client.commands.get(cmd.slice(prefix.length));

	    if(!commandfile) 
	    	return;

	    console.log(`[BOT] ${msg.author.tag} (${msg.channel.id}/${msg.channel.name}): ${msg.content}`);
	    try {
    		commandfile.default.run(client, prefix, msg, args);
    	}
    	catch {
    		let name = cmd.slice(prefix.length);
    		let props = await import(`./commands/${name}.js`);
			props.default.name = name;
			client.commands.set(name, props);
    	}
	}
}

export default exports;