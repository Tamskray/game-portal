import React, { useContext } from "react";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_EMAIL,
} from "../../utils/validators";
import ImageUpload from "../image-upload/ImageUpload";
import Button from "../UI/Button/Button";
import Input from "../UI/input/Input";
import ServerError from "../UI/serverError/ServerError";

const UpdateUserProfile = ({ user, closeModal, refreshInfo }) => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      username: {
        value: user.username,
        isValid: true,
      },
      email: {
        value: user.email,
        isValid: true,
      },
      image: {
        value: user.image,
        isValid: true,
      },
    },
    true
  );

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("username", formState.inputs.username.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("image", formState.inputs.image.value);

      console.log(
        formState.inputs.username.value,
        formState.inputs.email.value
      );

      await sendRequest(
        `${process.env.REACT_APP_API_URL}/users/update-profile/${user.userId}`,
        "PATCH",
        formData,
        { Authorization: "Bearer " + auth.token }
      );

      !error && closeModal();
      refreshInfo();
    } catch (err) {
      console.log(err);
    }

    // !error && closeModal();
  };

  return (
    <>
      {error && <ServerError error={error} />}

      <Input
        id="username"
        element="input"
        type="text"
        label="Нікнейм"
        placeholder="Введіть нікнейм.."
        validators={[VALIDATOR_MINLENGTH(3), VALIDATOR_MAXLENGTH(24)]}
        errorText="Нікнейм має бути від 3 до 24 символів"
        onInput={inputHandler}
        initialValue={formState.inputs.username.value}
        initialValid={true}
        clearError={clearError}
      />

      <Input
        element="input"
        id="email"
        type="email"
        label="Електронна пошта"
        validators={[VALIDATOR_EMAIL()]}
        errorText="Введіть вірну електронну пошту"
        onInput={inputHandler}
        initialValue={formState.inputs.email.value}
        initialValid={true}
        clearError={clearError}
      />

      <ImageUpload
        center
        id="image"
        onInput={inputHandler}
        errorText="Оберіть зображення"
        imageUrl={user.image && process.env.REACT_APP_URL + user.image}
        width="250px"
        height="250px"
      />

      <div className="center">
        <Button
          label="Зберегти"
          inverse
          size="big"
          disabled={!formState.isValid}
          onClick={updateUserProfile}
        />
      </div>
    </>
  );
};

export default UpdateUserProfile;
