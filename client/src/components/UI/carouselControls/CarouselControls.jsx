import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import cl from "./CarouselControls.module.css";

export const renderCenterLeftControls = ({
  previousDisabled,
  previousSlide,
}) => (
  <button
    className={cl.arrow__btn}
    disabled={previousDisabled}
    onClick={previousSlide}
    aria-label="Попередній слайд"
  >
    <BsFillArrowLeftCircleFill size={32} />
  </button>
);

export const renderCenterRightControls = ({ nextDisabled, nextSlide }) => (
  <button
    className={cl.arrow__btn}
    disabled={nextDisabled}
    onClick={nextSlide}
    aria-label="Наступний слайд"
  >
    <BsFillArrowRightCircleFill size={32} />
  </button>
);
