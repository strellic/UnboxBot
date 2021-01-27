import helpers from '../src/helpers.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	let embed = helpers.embed()
	.setTitle(`Filter Help`)
	.setDescription(`Filters can be used with the **${prefix}items** and **${prefix}sell** commands in order to select certain groups of items. Using filters, you can search for items in price ranges, with certain floats, rarities, and more.`);

	embed.addField("Format", "Filters are in the format **<type>:<value>**, where type is one of the types below, and value is the range you want to filter. The <value> can begin with >, >=, <, or <= to filter ranges.")

	embed.addField("List of filters:", `id (number)
name (AK-47 | Case Hardened)
price (10, 20, 30)
type (AK-47, AWP, Sticker, etc...)
family (Dragon Lore, Howl)
float (0.5, decimal values)
rarity (2, 3, 4, rarity level)
stattrak (true, false)
souvenir (true, false)
favorite (true, false)
`);

	embed.addField("Example:", `**${prefix}items float:<=0.25 price:>50 type:AK-47 stattrak:true**`);

	embed.addField("Sorting:", "You can also sort the results using the filter types **sort** or **sort_asc**. Use the critera you want to sort by as the value.");
	embed.addField("Example:", `**${prefix}items price:>100 sort:price**`);

	embed.addField("Note:", `If the value you want to search by has a space, replace it with a **_**.\nExample: **${prefix}items type:Galil_AR**`);

	msg.channel.send(embed);
}

exports.help = "Gives a description on how to use filters.";

export default exports;