const { Router } = require("express");
const winesController = require("../controllers/wines.controller");
const validate = require("../middlewares/validate");
const {
  getWinesSchema,
  getWineByIdSchema,
  createWineSchema,
  updateWineSchema,
  deleteWineSchema,
} = require("./wines.schema");

const router = Router();

router.get("/", validate(getWinesSchema), winesController.getAll);
router.get("/:id", validate(getWineByIdSchema), winesController.getById);
router.post("/", validate(createWineSchema), winesController.create);
router.put("/:id", validate(updateWineSchema), winesController.update);
router.delete("/:id", validate(deleteWineSchema), winesController.remove);

module.exports = router;
