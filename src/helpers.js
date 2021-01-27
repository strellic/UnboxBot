import Discord from 'discord.js';
import fs from 'fs';

import path from 'path';
import url from 'url';

import mergeImages from './mergeImages.js';
import Canvas from 'canvas';
import { v4 as uuidv4 } from 'uuid';

import animate from './animate.js';
import csgoData from './csgoData.js';

const settings = JSON.parse(fs.readFileSync("settings.json"));

let exports = {};

exports.snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.droppables = ["awp", "mp9", "mp7", "nova", "p90", "aug", "m4a4", "p250", "famas", "g3sg1", "m249", "mag-7", "negev", "p2000", "mac-10", "tec-9", "ump-45", "usp-s", "ak-47", "bayonet", "galil ar", "m4a1-s", "mp5-sd", "scar-20", "sg 553", "ssg 08", "xm1014", "cz75-auto", "glock-18", "karambit", "gut knife", "pp-bizon", "five-seven", "flip knife", "m9 bayonet", "sawed-off","bowie knife", "moto gloves", "nomad knife", "r8 revolver", "talon knife", "ursus knife", "desert eagle", "navaja knife", "sport gloves", "classic knife", "dual berettas", "hand wraps", "falchion knife", "huntsman knife", "paracord knife", "shadow daggers", "skeleton knife", "stiletto knife", "survival knife", "butterfly knife", "driver gloves", "hydra gloves", "specialist gloves", "bloodhound gloves"];

exports.canHaveStickers = ["awp", "mp9", "mp7", "nova", "p90", "aug", "m4a4", "p250", "famas", "g3sg1", "m249", "mag-7", "negev", "p2000", "mac-10", "tec-9", "ump-45", "usp-s", "ak-47", "galil ar", "m4a1-s", "mp5-sd", "scar-20", "sg 553", "ssg 08", "xm1014", "cz75-auto", "glock-18", "pp-bizon", "five-seven", "sawed-off", "r8 revolver", "desert eagle", "dual berettas"];

exports.embed = () => {
	const embed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setAuthor(settings.botName)
	.setTimestamp()
	.setFooter(settings.botName);
	return embed;
}

exports.resetReactions = (r, userId = -1) => {
    r.users.fetch().then(users => {
        users.forEach(user => {
            if(user.id != userId)
                r.users.remove(user);
        });
    });
}

exports.menuify = async (msg, embed, options, edit = false) => {
    let sentMsg = null;
    if(edit) {
        sentMsg = await msg.edit(embed);
    }
    else {
        sentMsg = await msg.channel.send(embed);
    }

    let collectors = [];
    options.forEach(option => {
        let filter = null;

        if(option.lock)
            filter = (reaction, user) => reaction.emoji.name === option.reaction && user.id !== sentMsg.author.id && user.id === option.lock;
        else
            filter = (reaction, user) => reaction.emoji.name === option.reaction && user.id !== sentMsg.author.id;

        let collector = sentMsg.createReactionCollector(filter, {timer: option.timer || 15000});
        collectors.push(collector);

        collector.on('collect', (r, user) => {
            exports.resetReactions(r, sentMsg.author.id);
            option.run(r, collectors, sentMsg, embed, user);
        });
    });
    for(let option of options) {
        if(!option.disabled)
            await sentMsg.react(option.reaction);
    }
    return sentMsg;
}

exports.menuifyFields = (msg, embed, fields, edit = false) => {
	let pages = exports.chunkArr(fields, 10);
	let page = 1;

	embed.setFooter(`Page ${page} of ${pages.length}`);
	embed.addFields(...pages[page-1]);

    if(pages.length === 1) {
        if(edit) {
            msg.edit(embed);
        }
        else {
            msg.channel.send(embed);
        }
        return;
    }

    let options = [
        {reaction: '⬅', run: (r, collectors, msg, embed) => {
            if (page === 1) 
                page = pages.length + 1;

            page--;
            embed.fields = [];
            embed.addFields(...pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed);
        }},
        {reaction: '➡', run: (r, collectors, msg, embed) => {
            if (page === pages.length)
                page = 0;

            page++;

            embed.fields = [];
            embed.addFields(...pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed);
        }},
    ];

    exports.menuify(msg, embed, options, edit);
}

exports.menuifyDescription = (msg, embed, lines, edit = false, page = 1, lock = false) => {
    if(page < 1 || page > lines.length)
        page = 1;

    embed.setFooter(`Page ${page} of ${lines.length}`);
    embed.setDescription(lines[page-1]);

    if(lines.length < 2) {
        if(lines.length == 0) {
            embed.setFooter(`Page 1 of 1`);
            embed.setDescription(``);
        }

        if(edit) {
            msg.edit(embed);
        }
        else {
            msg.channel.send(embed);
        }
        return;
    }

    let options = [
        {reaction: '⬅', lock: lock, run: (r, collectors, msg, embed) => {
            if (page === 1) 
                page = lines.length + 1;

            page--;
            embed.setDescription(lines[page-1]);
            embed.setFooter(`Page ${page} of ${lines.length}`);
            msg.edit(embed);
        }},
        {reaction: '➡', lock: lock, run: (r, collectors, msg, embed) => {
            if (page === lines.length)
                page = 0;

            page++;

            embed.setDescription(lines[page-1]);
            embed.setFooter(`Page ${page} of ${lines.length}`);
            msg.edit(embed);
        }},
    ];

    exports.menuify(msg, embed, options, edit);
}

exports.isAdmin = (user) => {
	return user.hasPermission("ADMINISTRATOR");
}

exports.chunkArr = (arr, size) => {
	let chunked = [];
	for(var i = 0; i < arr.length; i += size) {
		chunked.push(arr.slice(i, i+size));
	}
	return chunked;
}

exports.arrayKeys = (input) => {
    let five = 1;
    let total = 0;
    let output = new Array();
    let output2 = new Array();
    let output3 = new Array();
    let output4 = new Array();
    let counter = 0;
    let multiply = 4
    for (let i=0; i < input.length; i++)
    {
        five *= multiply;
        if(i != 0 && (input[i-1] - input[i]) > 1)
        {
            five *= multiply;
        }
        output[counter] = input[i];
        total = total + five;
        output2[i] = total;
        output4[i] = five;
        counter++;
    } 
    output3['levels'] = output;
    output3['rands'] = output2;
    output3['rands2'] = output4.reverse();
    output3['total'] = total;
    return output3;
}

exports.getRarityRNG = (rarities) => {
    let levels = exports.arrayKeys(rarities);

    let winNum = 0;
    let winLevel = 0;
    let rand = Math.floor(Math.random() * levels.total) + 1;
    for (let i = 0; i < levels.levels.length; i++) {
        if (rand <= levels.rands[i] && winNum == 0) {
            winNum = rand;
            winLevel = levels.levels[i];
        }
    }
    return winLevel;
}

exports.rngIndex = (choices) => {
    return Math.floor(Math.random() * choices.length);
}

exports.rngChoice = (choices) => {
    return choices[exports.rngIndex(choices)];
}

exports.rngRangeFloat = (min, max) => {
    return Math.random() * (max - min) + min;
}

exports.rngRangeInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.floatToName = (float) => {
    if(float <= 0.07)
        return "FN";
    else if(float <= 0.15)
        return "MW";
    else if(float <= 0.38)
        return "FT";
    else if(float <= 0.45)
        return "WW";
    return "BS";
}

exports.nameToFloat = (name) => {
    if(name == "FN")
        return exports.rngRangeFloat(0.0, 0.07);
    if(name == "MW")
        return exports.rngRangeFloat(0.07, 0.15);
    if(name == "FT")
        return exports.rngRangeFloat(0.15, 0.38);
    if(name == "WW")
        return exports.rngRangeFloat(0.38, 0.45);
    return exports.rngRangeFloat(0.45, 1.0);
}

exports.floatToFullName = (float) => {
    if(float <= 0.07)
        return "Factory New";
    else if(float <= 0.15)
        return "Minimal Wear";
    else if(float <= 0.38)
        return "Field-Tested";
    else if(float <= 0.45)
        return "Well-Worn";
    return "Battle-Scarred";
}

exports.rarityToColor = (rarity) => {
    return ["#B0C3D9", "#5E98D9", "#4B69FF", "#8847FF", "#D32CE6", "#EB4B4B", "#E4AE33"][rarity];
}

exports.rarityToEmoji = (rarity) => {
    return [
        "<:r0:740435426388738108>",
        "<:r1:740435426258714716>",
        "<:r2:740435426380087316>",
        "<:r3:740435426283749377>",
        "<:r4:740435426178760826>",
        "<:r5:740435426388475964>",
        "<:r6:740435426459779102>",
    ][rarity]
}

exports.rarityToName = (rarity) => {
    return [
        "Consumer Grade",
        "Industrial Grade",
        "Mil-Spec",
        "Restricted",
        "Classified",
        "Covert",
        "Contraband"
    ][rarity];
}

exports.itemToDisplay = (item, price = true) => {
    let msg = ``;

    if(item.favorite)
        msg += `:star: `;

    if(item.nickName)
        msg += `**"${item.nickName}"**`;
    else {
        if(item.statTrak)
            msg += `StatTrak™ `;
        else if(item.souvenir)
            msg += `Souvenir `;
        msg += item.name;
    }

    if(item.float)
        msg += ` (${exports.floatToName(item.float)})`;

    if(price)
        msg += ` [$${item.price.toFixed(2)}]`;

    return msg;
}

exports.getItemImage = (item, size = 360, asBuf = false) => {
    if(item.statTrak || (item.stickers && item.stickers.length > 0)) {
    	let imgs = [];

    	let scale = 1;
    	scale = size / 256;

    	let y = 0;
    	if(item.statTrak)
    		y = 96;

    	if(item.stickers) {
    		for(let i = 0; i < item.stickers.length; i++) {
	            imgs.push({
	                src: csgoData.itemToImg(item.stickers[i], size),
	                x: 96*i,
	                y: y,
	                width: 96,
	                height: 96
	            });
	        }   
    	}
  	 	
  	 	return new Promise((resolve, reject) => {
  	 		mergeImages([csgoData.itemToImg(item, size), {
  	 				src: "./assets/stattrak.png",
  	 				height: 96 * scale,
  	 				width: 96 * scale
  	 			}, ...imgs], {
	            Canvas: Canvas.Canvas,
	            Image: Canvas.Image
	        }).then(b64 => {
	        	b64 = b64.replace("data:image/png;base64,", "");
		        let buf = Buffer.from(b64, 'base64');

		        if(asBuf)
		            resolve(buf);

		        let uuid = uuidv4();

		        fs.writeFile(path.join(`./public/temp/`, `${uuid}.png`), buf, (err, data) => {
		        	if(err)
		        		reject(err)

		        	resolve(url.resolve(settings.url, `./temp/${uuid}.png`));
		        });
	        });
  	 	});
    }
    else {
        return csgoData.itemToImg(item, size);
    }
}

exports.setEmbedItemImage = async (embed, item) => {
	let img = await exports.getItemImage(item);
	embed.setImage(img);
	return;
}

exports.animate = async (items) => {
    let sources = [];
    for(let i = 0; i < items.length; i++) {
        let img = await exports.getItemImage(items[i], 180, true);
        sources.push({
            src: img,
            color: exports.rarityToColor(items[i].rarity)
        })
    }

    let loc = await animate.animate(sources);
    return url.resolve(settings.url, `./temp/${loc}`);
}

exports.animateMulti = async (items) => {
    let sources = [];
    let size = 140;

    if(items.length > 2)
    	size = 80;

    for(let i = 0; i < items.length; i++) {
    	sources[i] = [];
    	for(let j = 0; j < items[0].length; j++) {
    		let img = await exports.getItemImage(items[i][j], size, true);
	        sources[i].push({
	            src: img,
	            color: exports.rarityToColor(items[i][j].rarity)
	        });
    	}
    }

    console.log(size);

    let loc = await animate.animateMulti(sources);
    return url.resolve(settings.url, `./temp/${loc}`);
}

exports.itemFilter = (items, filter) => {
    let tokens = filter.split(" ");
    for(let i = 0; i < tokens.length; i++) {
        let token = tokens[i].toLowerCase();

        token = token.replace(/stattrak/i, "statTrak");
        token = token.replace(/nickname/i, "nickName");
        token = token.replace(/true|yes|on/gi, "1");
        token = token.replace(/false|no|off/gi, "0");

        let split = token.split(":");

        if(split.length != 2 || !token.includes(":")) {
            if(token in items[0] || (token.startsWith("!") && token.slice(1) in items[0])) {
                if(token.startsWith("!"))
                    items = items.filter(v => !v[token.slice(1)]);
                else
                    items = items.filter(v => v[token]);
            }
            else
                items = items.filter(v => v.name.toLowerCase().includes(token) || (v.nickName || "").toLowerCase().includes(token));
            
            continue;
        }

        let type = split[0];
        let value = split[1].replace(/_/g, " ");

        if(type == "sort_asc") {
            items = items.sort((a, b) => a[value] - b[value]);
            continue;
        }
        if(type == "sort") {
            items = items.sort((a, b) => b[value] - a[value]);
            continue;
        }

        if(type == "rarity") {
            let num = value.replace(/\D/g, '');
            value = value.replace(num, parseInt(num) - 1);
        }

        if(value[0] == ">") {
            if(value[1] == "=") {
                items = items.filter(i => {
                    if(Array.isArray(i[type]))
                        return i[type].length >= parseInt(value.slice(2));
                    if(typeof check == "number")
                        return check >= parseFloat(value.slice(2));
                    if(typeof check == "boolean")
                        return check >= Boolean(Number(value.slice(2)));
                    return i[type] >= value.slice(2);
                });
            }
            else {
                items = items.filter(i => {
                    if(Array.isArray(i[type]))
                        return i[type].length > parseInt(value.slice(1));
                    if(typeof check == "number")
                        return check > parseFloat(value.slice(1));
                    if(typeof check == "boolean")
                        return check > Boolean(Number(value.slice(1)));
                    return i[type] > value.slice(1);
                });
            }
        }
        else if(value[0] == "<") {
            if(value[1] == "=") {
                items = items.filter(i => {
                    if(Array.isArray(i[type]))
                        return i[type].length <= parseInt(value.slice(2));
                    if(typeof check == "number")
                        return check <= parseFloat(value.slice(2));
                    if(typeof check == "boolean")
                        return check <= Boolean(Number(value.slice(2)));
                    return i[type] <= value.slice(2);
                });
            }
            else {
                items = items.filter(i => {
                    if(Array.isArray(i[type]))
                        return i[type].length < parseInt(value.slice(1));
                    if(typeof check == "number")
                        return check < parseFloat(value.slice(1));
                    if(typeof check == "boolean")
                        return check < Boolean(Number(value.slice(1)));
                    return i[type] < value.slice(1);
                });
            }
        }
        else {
            items = items.filter(i => {
                if(typeof check == "number")
                    return check == parseFloat(value);
                if(typeof check == "boolean")
                    return check == Boolean(Number(value));
                if(typeof check == "string")
                    return check.toLowerCase() == value;

                return i[type] == value;
            });
        }
    }

    return items;
}

exports.resolveURL = (loc) => {
    return url.resolve(settings.url, loc);
}

export default exports;