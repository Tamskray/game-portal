import React, { useEffect, useRef, useState } from "react";
import Button from "../UI/Button/Button";
import "./ImageUpload.css";

const ImageUpload = ({
  id,
  center,
  onInput,
  errorText,
  imageUrl,
  width,
  height,
}) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState(imageUrl || undefined);
  //   const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    console.log("aaa " + imageUrl);
    // setPreviewUrl(imageUrl);
    // console.log("dsadas  " + previewUrl);
  }, []);

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

  return (
    <div className="form-control">
      <input
        id={id}
        type="file"
        ref={filePickerRef}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedImageHandler}
      />
      <div className={`image-upload ${center && "center"}`}>
        <div
          className="image-upload__preview"
          style={width && { width: width, height: height }}
        >
          {/* {previewUrl && !imageUrl && (
            <img src={imageUrl ? imageUrl : previewUrl} alt="Preview" />
          )}
          {imageUrl && (
            <img src={imageUrl ? imageUrl : previewUrl} alt="Preview" />
          )} */}
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Завантажте зображення</p>}
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
