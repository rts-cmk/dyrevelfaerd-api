var { Asset } = require("../models/models");
var saveFile = require("../services/asset");
var { imageSize } = require("image-size");
var { readFileSync } = require("fs");

function getJpgDimensions(filePath) {
	try {
		let dimensions = imageSize(readFileSync(filePath));

		if (dimensions && (dimensions.type === "jpg" || dimensions.type === "jpeg")) {
			return {
				width: dimensions.width || null,
				height: dimensions.height || null
			};
		}
	} catch (error) {
		console.error(error);
	}

	return {
		width: null,
		height: null
	};
}

async function createSingleAsset(req, res, next) {
	try {
		let dimensions = getJpgDimensions(req.files.file.path);
		let file = saveFile(req.files.file);
		let asset = await Asset.create({
			url: "http://localhost:4000/file-bucket/" + file,
			width: dimensions.width,
			height: dimensions.height
		});
		res.json(asset);
	} catch (error) {
		console.error(error);
		res.status(500).end();
	}
}

async function getAllAssets(req, res, next) {
	try {
		let assets = await Asset.findAll();
		res.json(assets);
	} catch (error) {
		console.error(error);
		res.status(500).end();
	}
}

async function getSingleAsset(req, res, next) {
	try {
		let asset = await Asset.findByPk(req.params.id);
		res.json(asset);
	} catch (error) {
		console.error(error);
		res.status(500).end();
	}
}

async function updateSingleAsset(req, res, next) {
	try {
		let asset = await Asset.findByPk(req.params.id);

		if (asset) {
			asset.url = req.fields.url;
			asset.save();
			res.json(asset);
		} else {
			res.status(404).end();
		}
	} catch(error) {
		console.error(error);
		res.status(500).end();
	}
}

module.exports = {
	createSingleAsset,
	getAllAssets,
	getSingleAsset,
	updateSingleAsset
};
