# UnboxBot
UnboxBot is my personal Discord bot, with a ton of features for fun and gambling.

The main purpose of the bot is to emulate CS:GO case unboxing so you can brag to your friends in your Discord server about being lucky enough to unbox an AWP Dragon Lore while at the same time still being poor.

When you unbox a case, the bot will generate an animated GIF to show you what items you were close to unboxing. Comes with other features that pretty much every other Discord bot has like coinflips and roulette (except this one is animated :D).

## Random Features
* Animated roulette-style case unboxing 
* (animated) Roulette and coinflip like every other bot
* Crash (where a multiplier goes up before it randomly crashes) 
* Stickers on weapons
* A admin web dashboard to rig case unboxings and coinflips :)
* Near real-time synchronization of item price to current market price
* Automatic setup of new weapons & cases thanks to [convars](http://convars.com/case/en) :^)

## Screenshots / GIFs
See them [here](SCREENSHOTS.md).

## Setup
1. Make a copy of `settings.json.example` and rename it to `settings.json`. Then, edit the fields, linking the bot to your MongoDB instance and giving it a URL and port to run on. Use a website like [this](https://gchq.github.io/CyberChef/#recipe=Bcrypt(12)&input=eW91cl9wYXNzd29yZA) to generate a bcrypt password for the admin dashboard.

2. Create a new bot on the Discord Developer dashboard, and copy its token to your `settings.json`. Invite the bot to your server by creating an OAUTH url, and give it the bot scope permission.

3. Run `npm install` to download all the dependencies.

4. `node index.js` to start the bot.

## Features I Planned to Work on but Never Did
* Trading
* Using webworkers / multithreading to generate the animated gifs

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
