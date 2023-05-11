import React from "react";

import Button from "../components/UI/Button/Button";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";

const UITestPage = () => {
  return (
    <>
      <h1 className="test">Hello</h1>
      <Button label="mMy btn" onClick={() => console.log("Clicks")} />
      <Button label="mMy btn" disabled size="small" />
      <Button label="Type" type="submit" size="big" />
      <Button label="Inverse" inverse />
      <Button label="Danger" danger size="big" />

      <LoadingSpinner />
    </>
  );
};

export default UITestPage;
