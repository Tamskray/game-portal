import React from "react";

import cl from "./PostItemSkeletom.module.css";

const PostItemSkeleton = (itemsNumber) => {
  const skeletonPosts = [];
  for (let i = 0; i < itemsNumber.itemsNumber; i++) {
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

export default PostItemSkeleton;
