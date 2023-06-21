import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../UI/avatar/Avatar";
import Button from "../UI/Button/Button";
import Modal from "../UI/modal/Modal";

import { GrClose } from "react-icons/gr";
import { AuthContext } from "../../context/auth-context";
import { useAuth } from "../../hooks/auth-hook";

import cl from "../../styles/UsersPage.module.css";

const UserItem = ({ id, username, email, roles, image, updateUserList }) => {
  const auth = useAuth(AuthContext);
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(roles[0]);

  const submitChangeUserRoleHandler = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/users/role/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({ newRole: selectedUserRole }),
      });

      console.log("Role Changed on " + selectedUserRole);
      closeRoleModalHandler();
      updateUserList();
    } catch (err) {
      console.log(err);
    }
  };

  const userRoleChangeHandler = (event) => {
    setSelectedUserRole(event.target.value);
  };

  const showRoleModalHandler = () => {
    setShowRoleModal(true);
  };

  const closeRoleModalHandler = () => {
    setShowRoleModal(false);
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmDeleteModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmDeleteModal(false);

    await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + auth.token },
    });
  };

  const modalHeader = (
    <div className={cl.modal__header}>
      <div>Зміна ролі</div>
      <GrClose className={cl.close__icon} onClick={closeRoleModalHandler} />
    </div>
  );

  const deleteModalHeader = (
    <div className={cl.modal__header}>
      <div>Ви впевнені?</div>
      <GrClose className={cl.close__icon} onClick={cancelDeleteHandler} />
    </div>
  );

  return (
    <>
      <Modal
        show={showRoleModal}
        onCancel={closeRoleModalHandler}
        header={modalHeader}
      >
        <>
          <h2 className="center">Оберіть роль для {username}</h2>
          <select value={selectedUserRole} onChange={userRoleChangeHandler}>
            <option>USER</option>
            <option>ADMIN</option>
          </select>
          <div className="center">
            <Button
              label="Змінити роль"
              inverse
              onClick={() => submitChangeUserRoleHandler()}
            />
          </div>
        </>
      </Modal>

      <Modal
        show={showConfirmDeleteModal}
        onCancel={cancelDeleteHandler}
        header={deleteModalHeader}
      >
        <p>
          Хочете продовжити і видалити користувача{" "}
          <span style={{ color: "#6b9bda" }}>{username}</span>? Зверніть увагу,
          що неможливо скасувати дії після цього!
        </p>
        <div className="center">
          <Button
            label={`Видалити ${username}`}
            danger
            size="big"
            onClick={confirmDeleteHandler}
          />
        </div>
      </Modal>

      <div className={cl.user__item}>
        <div>
          <Avatar
            image={
              image
                ? process.env.REACT_APP_URL + image
                : "https://cdn-icons-png.flaticon.com/512/5397/5397197.png"
            }
            alt={username}
            width="3rem"
            height="3rem"
          />
        </div>

        <div className={cl.username} onClick={() => navigate(`/${id}/posts`)}>
          {username}
        </div>
        <div className={cl.email}>{email}</div>
        <div
          className={
            roles && roles[0] === "ADMIN" ? cl.role__admin : cl.role__user
          }
        >
          {roles && roles[0]}
        </div>
        <Button label="Змінити роль" onClick={showRoleModalHandler} />
        <Button label="Видалити" danger onClick={showDeleteWarningHandler} />
      </div>
    </>
  );
};

export default UserItem;
