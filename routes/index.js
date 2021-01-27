import express from 'express';
let router = express.Router()

router.get('/', (req, res) => {
	if(req.session.authenticated)
		res.redirect("/users");
	else
		res.render('login', {title: "Login", error: req.session.error});

	req.session.error = null;
})

export default router;