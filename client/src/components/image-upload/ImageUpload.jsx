import React, { useEffect, useRef, useState } from "react";
import Button from "../UI/Button/Button";
import "./ImageUpload.css";

const ImageUpload = ({ id, center, onInput, errorText }) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  //   const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedImageHandler = (event) => {
    // console.log(event.target);
    let pickedFile;
    // let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      //   setIsValid(true);
      //   fileIsValid = true;
    } else {
      //   setIsValid(false);
      //   fileIsValid = false;
    }
    // onInput(id, pickedFile, fileIsValid);
    onInput(id, pickedFile, true);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  // css class form-control from Input.css
  return (
    <div className="form-control">
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedImageHandler}
      />
      <div className={`image-upload ${center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button
          label="Обрати зображення"
          type="button"
          onClick={pickImageHandler}
        />
      </div>
      {/* {!isValid && <p>{errorText}</p>} */}
    </div>
  );
};

export default ImageUpload;
