const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");
const authController = require("../controllers/authController");

// Vault routes
router.post("/vault", authController.protect, dataController.saveData);
router.get("/vault", authController.protect, dataController.getVaultItems);
router.patch("/vault/:id", authController.protect, dataController.editItem);
router.delete("/vault/:id", authController.protect, dataController.deleteItem);
router.delete(
  "/vault",
  authController.protect,
  dataController.deleteMultipleItems
);

module.exports = router;
