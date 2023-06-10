import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../utils/validators";

import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import ImageUpload from "../components/image-upload/ImageUpload";
import Input from "../components/UI/input/Input";
import Button from "../components/UI/Button/Button";

const UpdateGamePage = () => {
  const auth = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();
  const [loadedGame, setLoadedGame] = useState();
  const [releaseDate, setReleaseDate] = useState("");

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      developer: {
        value: "",
        isValid: false,
      },
      platforms: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: true,
      },
      //   hours: {
      //     value: [],
      //     isValid: true,
      //   },
      //   achievements: {
      //     value: [],
      //     isValid: true,
      //   },
    },
    false
  );

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/games/${params.gameId}`
        );
        setLoadedGame(responseData.game);
        setFormData(
          {
            title: {
              value: responseData.game.title,
              isValid: true,
            },
            description: {
              value: responseData.game.description,
              isValid: true,
            },
            developer: {
              value: responseData.game.developer,
              isValid: true,
            },
            platforms: {
              value: responseData.game.platforms,
              isValid: true,
            },
            image: {
              value: responseData.game.image,
              isValid: true,
            },
            //   hours: {
            //     value: [],
            //     isValid: true,
            //   },
            //   achievements: {
            //     value: [],
            //     isValid: true,
            //   },
          },
          false
        );
        setReleaseDate(responseData.game.date);
      } catch (err) {
        console.log(err);
      }
    };

    fetchGame();
  }, [sendRequest, params.gameId, setFormData]);

  const gameUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("developer", formState.inputs.developer.value);
      formData.append("platforms", formState.inputs.platforms.value);
      formData.append("date", releaseDate);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        `http://localhost:5000/api/games/${params.gameId}`,
        "PATCH",
        formData,
        { Authorization: "Bearer " + auth.token }
      );

      navigate(`/game/${loadedGame._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedGame && !error) {
    return (
      <div className="center">
        <h2>Не знайдено гру</h2>
      </div>
    );
  }

  return (
    <>
      <h2>Оновлення даних про гру</h2>
      <form className="place-form" onSubmit={gameUpdateSubmitHandler}>
        {isLoading && <LoadingSpinner />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Назва"
          placeholder="Введіть назву гри.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Введіть назву"
          onInput={inputHandler}
          initialValue={formState.inputs.title.value}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Короткий опис"
          placeholder="Введіть короткий опис гри.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Введіть короткий опис"
          onInput={inputHandler}
          initialValue={formState.inputs.description.value}
          initialValid={true}
        />
        <Input
          id="developer"
          element="input"
          type="text"
          label="Розробник"
          placeholder="Введіть розробника гри.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Введіть розробника гри.."
          onInput={inputHandler}
          initialValue={formState.inputs.developer.value}
          initialValid={true}
        />
        <Input
          id="platforms"
          element="input"
          type="text"
          label="Платформи"
          placeholder="Введіть платформи.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Введіть платформи.."
          onInput={inputHandler}
          initialValue={formState.inputs.platforms.value}
          initialValid={true}
        />

        <label>Дата виходу</label>
        <p>
          <input
            type="date"
            name="date"
            value={releaseDate.split("T")[0]}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </p>

        <label>Обкладинка гри</label>
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          errorText="Оберіть зображення"
          width="250px"
          height="320px"
          imageUrl={
            loadedGame.image && "http://localhost:5000/" + loadedGame.image
          }
        />

        <Button
          label="Оновити дані про  гру"
          type="submit"
          disabled={!formState.isValid || releaseDate === ""}
        />
      </form>
    </>
  );
};

export default UpdateGamePage;
