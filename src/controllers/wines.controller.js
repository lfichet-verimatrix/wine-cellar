const winesService = require("../services/wines.service");

async function getAll(req, res) {
  const filter = {};
  if (req.query.type) {
    filter.type = req.query.type;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.search) {
    filter.search = req.query.search;
  }
  const wines = await winesService.getAllWines(filter);
  res.json({ success: true, data: wines });
}

async function getById(req, res) {
  const wine = await winesService.getWineById(req.params.id);
  res.json({ success: true, data: wine });
}

async function create(req, res) {
  const wine = await winesService.createWine(req.body);
  res.status(201).json({ success: true, data: wine });
}

async function update(req, res) {
  const wine = await winesService.updateWine(req.params.id, req.body);
  res.json({ success: true, data: wine });
}

async function remove(req, res) {
  await winesService.deleteWine(req.params.id);
  res.json({ success: true, data: null });
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
