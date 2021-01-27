import helpers from '../src/helpers.js';

let exports = {};

exports.run = (client, prefix, msg, args) => {
	let embed = helpers.embed()
	.setTitle("Help Menu");

	let fields = [];
	client.commands.forEach(cmd => {
		fields.push({
			name: `${prefix}${cmd.default.name}`,
			value: cmd.default.help
		});
	});

	helpers.menuifyFields(msg, embed, fields);
}

exports.help = "Shows this menu!";

export default exports;