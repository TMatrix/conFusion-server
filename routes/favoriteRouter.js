const express = require("express");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Favorites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter
	.route("/")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.populate(["user", "dishes"])
			.then((favorites) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(favorites);
			})
			.catch((err) => next(err));
	})

	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.then((favorites) => {
				if (favorites) {
					const newFavorites = req.body
						.map((el) => el._id)
						.filter((el) => favorites.dishes.indexOf(el) === -1);
					if (newFavorites.length !== 0) favorites.dishes.push(newFavorites);
					favorites.save().then((favorites) => {
						Favorites.findById(favorites._id)
							.populate(["user", "dishes"])
							.then((favorites) => {
								res.statusCode = 200;
								res.setHeader("Content-Type", "application/json");
								res.json(favorites);
							});
					});
				} else {
					Favorites.create({ user: req.user._id, dishes: req.body }).then(
						(favorites) => {
							Favorites.findById(favorites._id)
								.populate(["user", "dishes"])
								.then((favorites) => {
									res.statusCode = 200;
									res.setHeader("Content-Type", "application/json");
									res.json(favorites);
								});
						}
					);
				}
			})
			.catch((err) => next(err));
	})

	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorites.remove({ user: req.user._id })
			.then((result) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(result);
			})
			.catch((err) => next(err));
	});

favoriteRouter
	.route("/:dishId")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.then(
				(favorites) => {
					if (!favorites) {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						return res.json({ exists: false, favorites });
					} else {
						if (favorites.dishes.indexOf(req.params.dishId) < 0) {
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json");
							return res.json({ exists: false, favorites });
						} else {
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json");
							return res.json({ exists: true, favorites });
						}
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.then((favorites) => {
				if (favorites) {
					const newFavorites = req.params.dishId;
					if (favorites.dishes.indexOf(newFavorites) === -1)
						favorites.dishes.push(newFavorites);
					favorites.save().then((favorites) => {
						Favorites.findById(favorites._id)
							.populate(["user", "dishes"])
							.then((favorites) => {
								res.statusCode = 200;
								res.setHeader("Content-Type", "application/json");
								res.json(favorites);
							});
					});
				} else {
					Favorites.create({
						user: req.user._id,
						dishes: [req.params.dishId],
					}).then((favorites) => {
						Favorites.findById(favorites._id)
							.populate(["user", "dishes"])
							.then((favorites) => {
								res.statusCode = 200;
								res.setHeader("Content-Type", "application/json");
								res.json(favorites);
							});
					});
				}
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id })
			.then((favorites) => {
				if (favorites) {
					favorites.dishes.splice(
						favorites.dishes.indexOf(req.params.dishId),
						1
					);
					favorites.save().then((favorites) => {
						Favorites.findById(favorites._id)
							.populate(["user", "dishes"])
							.then((favorites) => {
								res.statusCode = 200;
								res.setHeader("Content-Type", "application/json");
								res.json(favorites);
							});
					});
				} else {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(favorites);
				}
			})
			.catch((err) => next(err));
	});
module.exports = favoriteRouter;
