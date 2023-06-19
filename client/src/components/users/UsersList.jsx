import React from "react";
import UserItem from "./UserItem";

const UsersList = ({ items, updateUserList }) => {
  if (items.length === 0) {
    return (
      <div className="center">
        <h2>Користувачів не знайдено</h2>
      </div>
    );
  }

  console.log(items);

  return (
    <>
      <ul>
        {items.map((user) => (
          <UserItem
            key={user._id}
            id={user._id}
            username={user.username}
            email={user.email}
            roles={user.roles}
            image={user.image}
            updateUserList={updateUserList}
          />
          //   <h2>{user.roles[0]}</h2>
        ))}
      </ul>
    </>
  );
};

export default UsersList;
