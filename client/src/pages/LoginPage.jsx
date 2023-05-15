import React, { useState } from "react";
import { useForm } from "../hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../utils/validators";

import Input from "../components/UI/input/Input";
import Button from "../components/UI/Button/Button";

import { Transition } from "react-transition-group";

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
          // image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: "",
            isValid: false,
          },
          // image: {
          //   value: null,
          //   isValid: false,
          // },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  const loginSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState);
  };

  return (
    <>
      <Transition in={isLoginMode} timeout={300}>
        {(state) => (
          <div className={`authentication place-form ${state}`}>
            {/* {isLoading && <LoadingSpinner asOverlay />} */}
            <form onSubmit={loginSubmitHandler}>
              {!isLoginMode && (
                <Input
                  element="input"
                  id="username"
                  type="text"
                  label="Нікнейм"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Введіть нікнейм"
                  onInput={inputHandler}
                />
              )}
              {/* {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please pick image"
            />
          )} */}
              <Input
                element="input"
                id="email"
                type="email"
                label="Електронна пошта"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Введіть вірну електронну пошту"
                onInput={inputHandler}
              />
              <Input
                element="input"
                id="password"
                type="password"
                label="Пароль"
                validators={[VALIDATOR_MINLENGTH(4)]}
                errorText="Введіть пароль (min. 4 characters)"
                onInput={inputHandler}
              />
              <Button
                type="submit"
                inverse
                label={isLoginMode ? "УВІЙТИ" : "ЗАРЕЄСТРУВАТИСЯ"}
                disabled={!formState.isValid}
              />
            </form>
            <Button
              label={`Перейти до ${isLoginMode ? "реєстрації" : "авторизації"}`}
              onClick={switchModeHandler}
            />
          </div>
        )}
      </Transition>
    </>
  );
};

export default LoginPage;
