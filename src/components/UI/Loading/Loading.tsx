import React from "react";

import cl from "./Loading.module.css";

interface Props {
  asOverlay?: boolean;
}

const Loading = ({ asOverlay }: Props): React.ReactElement => {
  return (
    <div className={`${asOverlay && cl.loading_spinner__overlay}`}>
      <div className={cl.lds_dual_ring}></div>
    </div>
  );
};

export default Loading;
