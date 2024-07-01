import React from "react";

import cl from "./PostListSkeleton.module.css";

interface Props {
  itemsNumber: number;
}

const PostListSleleton = ({ itemsNumber }: Props): React.ReactElement => {
  const skeletonPosts = [];
  for (let i = 0; i < itemsNumber; i++) {
    skeletonPosts.push(
      <div key={i} className={cl.skeleton__container}>
        <div className={cl.skeleton__content}>
          <div className={cl.skeleton__content__image}></div>
          <div>
            <div className={cl.skeleton__content__rubric}></div>
            <div className={cl.skeleton__content__title}></div>
            <div className={cl.skeleton__content__description}></div>
            <div className={cl.skeleton__content__description}></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{skeletonPosts}</>;
};

export default PostListSleleton;
