import * as fs from "fs";
import Game from "../models/Game.js";

class GamesController {
  async getGames(req, res) {
    try {
      // const users = await User.find({}, "-password");
      const games = await Game.find();

      // just check
      // const formattedUsers = users.map(({ id, username }) => {
      //   return { id, username };
      // });

      res.status(200).json(games);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

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

  async searchGame(req, res) {
    const searchQuery = req.query.q;

    try {
      let games;
      if (searchQuery) {
        games = await Game.aggregate([
          {
            $search: {
              index: "game-search",
              autocomplete: {
                query: searchQuery,
                path: "title",
              },
            },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              _id: 1,
              title: 1,
              developer: 1,
              image: 1,
            },
          },
        ]);

        if (
          games.length === 0 &&
          searchQuery !== undefined &&
          searchQuery.length > 2
        ) {
          games = "Нічого не знайдено";
        }
      } else {
        games = "";
      }

      res.json(games);
    } catch (error) {
      res.status(500).json({ error: "Error with searching games" });
    }
  }

  // CREATE
  async createGame(req, res) {
    // express validation results

    const { title, description, developer, platforms, date } = req.body;

    let imagePath;
    if (req.file) {
      imagePath = req.file.path;
    } else {
      imagePath = null;
    }

    const newGame = new Game({
      title,
      description,
      developer,
      platforms,
      date,
      image: imagePath,
      // image: null,
      hours: [],
      achievements: [],
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

  // UPDATE
  async updateGame(req, res) {
    // express validation results

    const { title, description, developer, platforms, date } = req.body;
    const gameId = req.params.gid;

    let game;
    try {
      game = await Game.findById(gameId);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a game", err });
    }

    if (req.file) {
      game.image &&
        fs.unlink(game.image, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
    }

    let imagePath;
    if (req.file) {
      imagePath = req.file.path;
    } else {
      imagePath = game.image;
    }

    game.title = title;
    game.description = description;
    game.developer = developer;
    game.platforms = platforms;
    game.date = date;
    game.image = imagePath;

    try {
      await game.save();
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong, could not update a game",
        err,
      });
    }

    res.status(200).json(game);
  }
}

export default new GamesController();
