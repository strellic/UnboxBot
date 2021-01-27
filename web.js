import fs from 'fs';
import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieSession from 'cookie-session';

import index from './routes/index.js';
import api from './routes/api.js';
import user from './routes/user.js';
import users from './routes/users.js';

const settings 		= JSON.parse(fs.readFileSync("settings.json"));
const __dirname 	= path.dirname(new URL(import.meta.url).pathname);

const app = express();
app.set('trust proxy', 1);

const session = cookieSession({
    secret: settings.webSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secureProxy: true,
        httpOnly: true,
        domain: settings.url,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
});
app.use(session);

const port = settings.port;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);
app.use('/user', user);
app.use('/users', users);

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(port, () => {
	console.log(`[WEB] Bot website launched at http://localhost:${port}`);
});