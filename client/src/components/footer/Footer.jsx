import React from "react";

import { AiFillGithub } from "react-icons/ai";

import cl from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={cl.footer__container}>
      <div className={cl.footer__item}>
        <div>Developed by Vlad Kopylov</div>
        <AiFillGithub
          onClick={() =>
            window.open("https://github.com/Tamskray/mern-game-portal")
          }
          className={cl.footer__git__icon}
        />
      </div>
    </div>
  );
};

export default Footer;
