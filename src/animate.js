import GIFEncoder from 'gifencoder';
import createCollage from './photoCollage.js';
import { v4 as uuidv4 } from 'uuid';

import Canvas from 'canvas';
import fs from 'fs';

let exports = {};

exports.animate = (sources) => {
	let width = 128;
	let height = 128;

	return new Promise((resolve, reject) => {
		let id = uuidv4();
		let loc = `./public/temp/${id}`;

		const encoder = new GIFEncoder(width * 3, height);
		let stream = fs.createWriteStream(`${loc}.gif`);
		encoder.createReadStream().pipe(stream);

		stream.on('finish', () => {
			resolve(id);
		});
  		stream.on('error', reject);

		encoder.start();
		encoder.setRepeat(-1);
		encoder.setDelay(100);
		encoder.setQuality(25);

		const options = {
			sources: sources,
			width: sources.length, // number of images per row
			height: 1, // number of images per column
			imageWidth: width, // width of each image
			imageHeight: height, // height of each image
			backgroundColor: "#cccccc", // optional, defaults to black.
			textStyle: 0 //???
		};

		console.log(options);

		createCollage(options).then((img) => {
		    const canvas = Canvas.createCanvas(width * 3, height);
			const ctx = canvas.getContext('2d');

			let start = canvas.width / 2 - (width / 2);
			let end = (canvas.width / 2) + (width * sources.length) - Math.floor(Math.random() * (width / 2)) + width;

			let frames = 5;
			let dx = (end - start) / frames;

			for(let i = 0; i < frames; i++) {
				console.time(`frame_${i}`);
				ctx.fillStyle = "#cccccc";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				ctx.drawImage(img, start, 0, sources.length * width, height);

				ctx.fillStyle = "yellow";
				ctx.rect((canvas.width / 2) - 2, 0, 5, height);
				ctx.fill();

				start -= dx;

				encoder.addFrame(ctx);
				console.timeEnd(`frame_${i}`);
			}

			let final = canvas.createPNGStream();
			let stream = fs.createWriteStream(`${loc}.png`);
			final.pipe(stream);

			encoder.finish();
		});
	});
}

exports.animateMulti = (sources) => {
	let width = 128;
	let height = 128 * (sources.length);
	let rectWidth = 5;

	let maxWidth = 3;
	if(sources.length >= 5) {
		width = 64;
		height = 64 * (sources.length);
		rectWidth = 3;
		if(sources.length > 5) {
			maxWidth = 5;
			if(sources.length >= 9) {
				width = 32;
				height = 32 * (sources.length);
				rectWidth = 2;
			}
		}
	}

	console.log("a");

	return new Promise((resolve, reject) => {
		let id = uuidv4();
		let loc = `./public/temp/${id}`;

		console.log("b");

		const encoder = new GIFEncoder(width * maxWidth, height);
		let stream = fs.createWriteStream(`${loc}.gif`);
		encoder.createReadStream().pipe(stream);

		stream.on('finish', () => {
			resolve(id);
		});
  		stream.on('error', reject);

		encoder.start();
		encoder.setRepeat(-1);
		encoder.setDelay(100);
		encoder.setQuality(25);

		console.log("c");

		const options = {
			sources: sources.flat(),
			width: sources[0].length, // number of images per row
			height: sources.length, // number of images per column
			imageWidth: width, // width of each image
			imageHeight: height / sources.length, // height of each image
			backgroundColor: "#cccccc", // optional, defaults to black.
			textStyle: 0 //???
		};

		console.log(JSON.stringify(options));

		console.time("collage");
		createCollage(options).then((img) => {
			console.timeEnd("collage");

			console.log("d");

		    const canvas = Canvas.createCanvas(width * maxWidth, height);
			const ctx = canvas.getContext('2d');

			let start = canvas.width / 2 - (width / 2);
			let end = (canvas.width / 2) + (width * sources[0].length) - Math.floor(Math.random() * (width / 2)) + width;

			console.log(start, end);

			let frames = 5;
			let dx = (end - start) / frames;

			for(let i = 0; i < frames; i++) {
				console.time(`frame_${i}`);
				ctx.fillStyle = "#cccccc";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				ctx.drawImage(img, start, 0, sources[0].length * width, height);

				ctx.fillStyle = "yellow";
				ctx.rect((canvas.width / 2) - 2, 0, rectWidth, height);
				ctx.fill();

				start -= dx;

				encoder.addFrame(ctx);
				console.timeEnd(`frame_${i}`);
			}

			let final = canvas.createPNGStream();
			let stream = fs.createWriteStream(`${loc}.png`);
			final.pipe(stream);

			encoder.finish();
		});
	});
}

export default exports;