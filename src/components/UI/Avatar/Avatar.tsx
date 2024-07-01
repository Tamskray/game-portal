import React, { CSSProperties } from "react";

import "./Avatar.css";

interface Props {
  className?: string;
  style?: CSSProperties;
  image: string;
  alt: string;
  width: string;
  height: string;
  username: string | undefined;
}

const Avatar = ({ ...props }: Props): React.ReactElement => {
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
