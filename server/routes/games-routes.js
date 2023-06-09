import Router from "express";
import GamesController from "../controllers/games-controller.js";
// import { check } from "express-validator";
import { checkAuth } from "../middleware/check-auth.js";
// import { checkRole } from "../middleware/check-role.js";
import { fileUpload } from "../middleware/file-upload.js";

const router = new Router();

router.get("/", GamesController.getGames);

router.get("/search", GamesController.searchGame);

router.get("/:gid", GamesController.getGameById);

router.post("/", fileUpload.single("image"), GamesController.createGame);

export default router;
