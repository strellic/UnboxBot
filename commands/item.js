import helpers from '../src/helpers.js';
import csgoData from '../src/csgoData.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	if(!args[0] || isNaN(args[0])) {
		return msg.reply(`usage: ${prefix}item <item id>`);
	}

	let id = parseInt(args[0]);
	let item = await userData.getUserItem(msg.author, id);

	if(!item) {
		return msg.reply(`invalid item id.`);
	}

	let embed = helpers.embed()
	.setAuthor(msg.author.username)
	.setTitle(helpers.itemToDisplay(item, false))
	.addField(`Item ID`, item.id)
	.addField(`Value`, `$${item.price}`)
	.addField(`Rarity`, `${helpers.rarityToName(item.rarity)} [${item.rarity+1}]`)
	.setColor(helpers.rarityToColor(item.rarity))
	.setFooter(`${prefix}item ${item.id}`);

	if(item.float)
		embed.addField(`Float`, `${item.float} (${helpers.floatToName(item.float)})`)

	for(let i = 0; i < item.stickers.length; i++) {
		embed.addField(`${item.stickers[i].name} (#${i + 1})`, `$${item.stickers[i].price}`)
	}

	await helpers.setEmbedItemImage(embed, item);
	msg.channel.send(embed);
}

exports.help = "Inspects a specific item by id.";

export default exports;