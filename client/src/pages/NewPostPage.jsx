import React, { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import { useForm } from "../hooks/form-hook";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import Input from "../components/UI/input/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../utils/validators";
import Button from "../components/UI/Button/Button";

const NewPostPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      rubric: {
        value: "Новини",
        isValid: true,
      },
      description: {
        value: "",
        isValid: false,
      },
      content: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const postSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(formState);

    try {
      await sendRequest(
        "http://localhost:5000/api/posts",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          rubric: formState.inputs.rubric.value,
          description: formState.inputs.description.value,
          content: formState.inputs.content.value,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h2>Створення нового поста</h2>
      <form className="place-form" onSubmit={postSubmitHandler}>
        {isLoading && <LoadingSpinner />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Назва"
          placeholder="Введіть назву поста.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Введіть назву"
          onInput={inputHandler}
        />
        <Input
          id="rubric"
          element="input"
          type="text"
          label="Рубрика"
          initialValue={formState.inputs.rubric.value}
          initialValid={true}
          placeholder="Введіть рубрику поста.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Оберіть рубрику"
          onInput={inputHandler}
        />
        {/* <select onChange={rubricChangeHandler}>
          <option>Новини</option>
          <option>Статті</option>
        </select> */}
        <Input
          id="description"
          element="input"
          type="text"
          label="Короткий опис"
          placeholder="Введіть короткий опис.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Введіть короткий опис"
          onInput={inputHandler}
        />
        <Input
          id="content"
          element="textarea"
          type="text"
          label="Контент"
          placeholder="Творіть.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Заповніть поле"
          onInput={inputHandler}
        />
        <Button
          label="Створити пост"
          type="submit"
          disabled={!formState.isValid}
        />
      </form>
    </>
  );
};

export default NewPostPage;
