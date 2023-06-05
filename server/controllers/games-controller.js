import Game from "../models/Game.js";

class GamesController {
  async getGames(req, res) {}

  async getGameById(req, res) {
    const gameId = req.params.gid;
    let game;
    try {
      game = await Game.findById(gameId);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a game" });
    }

    if (!game) {
      return res
        .status(404)
        .json({ message: "Could not find game for provided id" });
    }

    let gameInfo;
    let steamAppId;

    // Search game to get steamapp ID
    try {
      const response = await fetch(
        `https://store.steampowered.com/api/storesearch/?term=${game.title}&l=english&cc=ua`
      );

      gameInfo = await response.json();
      steamAppId = gameInfo.items[0].id;
    } catch (err) {
      console.log(err);
    }

    // get achievements

    let achievements;
    try {
      const response = await fetch(
        `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=${steamAppId}&key=${process.env.STEAM_KEY}`
      );

      achievements = await response.json();
    } catch (err) {
      console.log(err);
    }

    let steamGameDetailInfo;
    try {
      const response = await fetch(
        `https://store.steampowered.com/api/appdetails/?appids=${steamAppId}`
      );

      steamGameDetailInfo = await response.json();
    } catch (err) {
      console.log(err);
    }

    // console.log(achievements.game.availableGameStats.achievements);

    res.json({ game, steamAppId, gameInfo, achievements, steamGameDetailInfo });
  }

  // CREATE
  async createGame(req, res) {
    // express validation results

    const { title, description, developer, platforms, date } = req.body;

    // let imagePath;
    // if (req.file) {
    //   imagePath = req.file.path;
    // } else {
    //   imagePath = null;
    // }

    const newGame = new Game({
      title,
      description,
      developer,
      platforms,
      date,
      image: null,
      hours: [],
      achievements: [],
      //   image: imagePath,
    });

    try {
      await newGame.save();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Creating game failed, please try again later", err });
    }

    res.status(201).json(newGame);
  }
}

export default new GamesController();
