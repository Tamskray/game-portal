import React from "react";
import { useForm } from "../../hooks/form-hook";
import Input from "../UI/input/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from "../../utils/validators";
import ImageUpload from "../image-upload/ImageUpload";
import Button from "../UI/Button/Button";

const UpdateUserProfile = ({ user, closeModal }) => {
  const [formState, inputHandler, setFormData] = useForm(
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
    // --------------------
    // fetch patch
  };

  return (
    <>
      {/* {user.username}
      {user.email} */}

      <Input
        id="username"
        element="input"
        type="text"
        label="Нікнейм"
        placeholder="Введіть нікнейм.."
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Введіть нікнейм"
        onInput={inputHandler}
        initialValue={formState.inputs.username.value}
        initialValid={true}
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
        />
      </div>
    </>
  );
};

export default UpdateUserProfile;
