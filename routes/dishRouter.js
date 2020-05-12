const express = require("express");
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter
	.route("/")
	.get((req, res, next) => {
		Dishes.find({})
			.then((dishes) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(dishes);
			})
			.catch((err) => next(err));
	})

	.post((req, res, next) => {
		Dishes.create(req.body)
			.then((dish) => {
				console.log("Dish Created: ", dish);
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(dish);
			})
			.catch((err) => next(err));
	})

	.put((req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /dishes");
	})

	.delete((req, res, next) => {
		Dishes.remove({})
			.then((result) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(result);
			})
			.catch((err) => next(err));
	});

dishRouter
	.route("/:dishId")
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(dish);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		res.statusCode = 403;
		res.end("POST operation not supported on /dishes/" + req.params.dishId);
	})
	.put((req, res, next) => {
		Dishes.findByIdAndUpdate(
			req.params.dishId,
			{ $set: req.body },
			{ new: true }
		)
			.then((dish) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(dish);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		Dishes.findByIdAndRemove(req.params.dishId)
			.then((result) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(result);
			})
			.catch((err) => next(err));
	});

module.exports = dishRouter;
