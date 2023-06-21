import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/auth-hook";
import { AuthContext } from "../context/auth-context";
import { useForm } from "../hooks/form-hook";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import Input from "../components/UI/input/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../utils/validators";

import cl from "../styles/NewGamePage.module.css";
import Button from "../components/UI/Button/Button";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import ImageUpload from "../components/image-upload/ImageUpload";

const NewGamePage = () => {
  const auth = useAuth(AuthContext);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
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

  const [releaseDate, setReleaseDate] = useState("");

  const addGameSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState, releaseDate);

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("developer", formState.inputs.developer.value);
      formData.append("platforms", formState.inputs.platforms.value);
      formData.append("date", releaseDate);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        `${process.env.REACT_APP_API_URL}/games`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h2>Додавання нової гри на портал</h2>
      <form className="place-form" onSubmit={addGameSubmitHandler}>
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
        />
        <label>Дата виходу</label>
        <p>
          <input
            type="date"
            name="date"
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
        />

        <Button
          label="Додати гру"
          type="submit"
          disabled={!formState.isValid || releaseDate === ""}
        />
      </form>
    </>
  );
};

export default NewGamePage;
