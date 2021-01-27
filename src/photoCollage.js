import Canvas from 'canvas';

const PARAMS = [{
        field: "sources",
        required: true
    },
    {
        field: "width",
        required: true
    },
    {
        field: "height",
        required: true
    },
    {
        field: "imageWidth",
        required: true
    },
    {
        field: "imageHeight",
        required: true
    },
    {
        field: "spacing",
        default: 0
    },
    {
        field: "backgroundColor",
        default: "#eeeeee"
    },
    {
        field: "lines",
        default: []
    },
    {
        field: "textStyle",
        default: {}
    },
]; 

export default (options) => {
    if (Array.isArray(options)) {
        options = {
            sources: options
        };
    }

    PARAMS.forEach((param) => {
        if (options[param.field]) {
            return;
        } else if (param.default != null) {
            options[param.field] = param.default;
        } else if (param.required) {
            throw new Error(`Missing required option: ${param.field}`);
        }
    });

    console.log("c1");

    const headerHeight = (options.header || {}).height || 0;
    const canvasWidth = options.width * options.imageWidth + (options.width - 1) * (options.spacing);
    const canvasHeight = headerHeight + options.height * options.imageHeight + (options.height - 1) * (options.spacing);
    const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    const sources = options.sources;
    let maxImages = options.width * options.height;
    if ((options.header || {}).image) {
        maxImages += 1;
        sources.unshift(options.header.image);
    }

    console.log("c2");

    let unique = [... new Set(sources.map(s => s.src))];

    let imgDl = (src, retry = false) => new Promise((resolve, reject) => {
        let img = new Canvas.Image();
        img.crossOrigin = options.crossOrigin;
        img.onerror = () => {
        	if(retry) {
        		console.log("[ERR] Couldn't load image @ photoCollage: ", src);

	            let placeholder = new Canvas.Image();
	            placeholder.crossOrigin = options.crossOrigin;
	            placeholder.onerror = () => {
	                console.log("[ERR] Couldn't load placeholder @ photoCollage!");
	            };
	            placeholder.onload = () => resolve([src, placeholder]);
	            placeholder.src = "./assets/unknown.png";
        	}
        	else {
        		console.log("retrying!");
        		imgDl(src, true).then(resolve);
        	}
        };

        let finished = false;

        setTimeout(() => {
            if(!finished)
                img.onerror();
        }, 2000);

        img.onload = () => {
            finished = true;
            resolve([src, img]);
        };
        img.src = src;
    });

    const promises = unique.map(src => imgDl(src));

    console.log("c3");

    return new Promise((resolve, reject) => {
        Promise.all(promises).then(dledArr => {
            let dled = Object.fromEntries(dledArr);

            for(let i = 0; i < sources.length; i++) {
                let img = dled[sources[i].src];

                if (i >= maxImages) return;
                if ((options.header || {}).image) { // only for header
                    if (!i) { // first time
                        ctx.drawImage(img, 0, 0, canvasWidth, options.header.height);
                        return;
                    }
                    i -= 1;
                }

                const x = (i % options.width) * (options.imageWidth + options.spacing);
                const y = Math.floor(i / options.width) * (options.imageHeight + options.spacing);

                if(sources[i].color) {
                    ctx.fillStyle = sources[i].color;
                    ctx.fillRect(x, y, options.imageWidth, options.imageHeight);
                }

                ctx.drawImage(img, x, y + headerHeight, options.imageWidth, options.imageHeight);
            }

            console.log("c5");

            resolve(canvas);
        });
    });
};