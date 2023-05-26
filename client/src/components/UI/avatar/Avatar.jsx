import React from "react";

import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
      <div style={{ marginLeft: 7 }}>{props.username}</div>
    </div>
  );
};

export default Avatar;
