const express = require("express");
const authenticate = require("../authenticate");

const Leaders = require("../models/leaders");

const leaderRouter = express.Router();

leaderRouter
	.route("/")
	.get((req, res, next) => {
		Leaders.find({})
			.then((leaders) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(leaders);
			})
			.catch((err) => next(err));
	})

	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Leaders.create(req.body)
			.then((leader) => {
				console.log("Promotion Created: ", leader);
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(leader);
			})
			.catch((err) => next(err));
	})

	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /leaders");
	})

	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Leaders.remove({})
				.then((result) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(result);
				})
				.catch((err) => next(err));
		}
	);

leaderRouter
	.route("/:leaderId")
	.get((req, res, next) => {
		Leaders.findById(req.params.leaderId)
			.then((leader) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(leader);
			})
			.catch((err) => next(err));
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("POST operation not supported on /leaders/" + req.params.leaderId);
	})
	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		Leaders.findByIdAndUpdate(
			req.params.leaderId,
			{ $set: req.body },
			{ new: true }
		)
			.then((leader) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(leader);
			})
			.catch((err) => next(err));
	})
	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Leaders.findByIdAndRemove(req.params.leaderId)
				.then((result) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(result);
				})
				.catch((err) => next(err));
		}
	);

module.exports = leaderRouter;
