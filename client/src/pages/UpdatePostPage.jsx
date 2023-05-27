import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../hooks/form-hook";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import Input from "../components/UI/input/Input";
import Button from "../components/UI/Button/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../utils/validators";
import { AuthContext } from "../context/auth-context";

const UpdatePostPage = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPost, setLoadedPost] = useState();
  const params = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/posts/${params.postId}`
        );
        setLoadedPost(responseData);
        setFormData(
          {
            title: {
              value: responseData.title,
              isValid: false,
            },
            rubric: {
              value: responseData.rubric,
              isValid: true,
            },
            description: {
              value: responseData.description,
              isValid: false,
            },
            content: {
              value: responseData.content,
              isValid: false,
            },
          },
          false
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [sendRequest, params.postId, setFormData]);

  const postUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/posts/${params.postId}`,
        "PATCH",
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

      navigate("/posts");
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

  if (!loadedPost && !error) {
    return (
      <div className="center">
        <h2>Не знайдено пост</h2>
      </div>
    );
  }

  return (
    <>
      <h2>Оновлення поста</h2>
      <form className="place-form" onSubmit={postUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Назва"
          placeholder="Введіть назву поста.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Введіть назву"
          onInput={inputHandler}
          initialValue={formState.inputs.title.value}
          initialValid={true}
        />
        <Input
          id="rubric"
          element="input"
          type="text"
          label="Рубрика"
          placeholder="Введіть рубрику поста.."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Оберіть рубрику"
          onInput={inputHandler}
          initialValue={formState.inputs.rubric.value}
          initialValid={true}
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
          initialValue={formState.inputs.description.value}
          initialValid={true}
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
          initialValue={formState.inputs.content.value}
          initialValid={true}
        />
        <Button
          label="Оновити пост"
          type="submit"
          disabled={!formState.isValid}
        />
      </form>
    </>
  );
};

export default UpdatePostPage;
