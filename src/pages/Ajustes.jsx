import { Avatar } from "@mui/material";
import { updateProfile } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useRef, useState, useEffect } from "react";
import { BsCheckLg } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { v4 } from "uuid";
import { auth, storage } from "../api/firebase-config";
import UserServices from "../api/user.services";
import { useNavigate } from "react-router-dom";

/**
 * @component
 * Renders a Settings component that allows the user to update their profile information and profile picture.
 *
 * @function
 * @name Settings
 *
 * @return {JSX.Element} JSX element representing the Settings component.
 *
 * @requires React from react
 * @requires useState from react
 * @requires useRef from react
 * @requires useEffect from react
 * @requires auth from ../api/firebase-config
 * @requires BsCheckLg from react-icons/bs
 * @requires GrAdd from react-icons/gr
 * @requires Modal from @mui/material
 * @requires Box from @mui/material
 * @requires Avatar from @mui/material
 * @requires ref from firebase/storage
 * @requires uploadBytes from firebase/storage
 * @requires getDownloadURL from firebase/storage
 * @requires deleteObject from firebase/storage
 * @requires storage from ../api/firebase-config
 * @requires v4 from uuid
 * @requires updateProfile from firebase/auth
 * @requires userServices from ../api/user.services
 */

const Settings = () => {
  /**
   * The current user that is authenticated.
   * @type {Object}
   */
  const currentUser = auth.currentUser;

  const [user, setUser] = useState(null);

  /**
   * The default URL for the profile picture.
   * @type {string}
   */
  const defaultProfilePicUrl =
    "https://firebasestorage.googleapis.com/v0/b/j1web-7dc6e.appspot.com/o/profilePics%2Fdefault%2Fblank-profile-picture-973460_1280.webp?alt=media&token=4196e70b-dbb5-4ca6-8526-9169a854635a";

  /**
   * The state of the change username input.
   * @type {boolean}
   */
  const [changing, isChanging] = useState(false);

  /**
   * The currently uploaded image.
   * @type {Object}
   */
  const [image, setImage] = useState(null);

  /**
   * Navigation hook
   * @type {function}
   */
  const navigate = useNavigate();

  /**
   * The profile picture of the current user.
   * @type {string}
   */
  const [profilePic, setProfilePic] = useState(currentUser.photoURL);

  const [userName, setUserName] = useState(currentUser.displayName);

  /**
   * A ref object that refers to the file input field.
   * @type {React.MutableRefObject<null>}
   */
  const fileRef = useRef(null);

  const nameRef = useRef(null);

  useEffect(() => {
    const set = () => setUser(UserServices.getUser(currentUser.uid));

    return () => {
      set();
    };
  }, [currentUser]);

  /**
   * Uploads an image and updates the current user's profile picture.
   * @function
   *
   * @param {Object} e - The event object generated by the upload.
   * @returns {void}
   */
  const handleUpload = (e) => {
    e.preventDefault();
    const imageRef = ref(
      storage,
      `profilePics/${currentUser.uid}/${image.name + v4()}`
    );
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        uploadProfilePic({ url });
      });
    });
    setImage(null);
    fileRef.current.value = null;
  };

  /**
   * Uploads a user's profile picture to Firebase storage and updates the user's document in Firestore.
   * @function
   *
   * @param {Object} data - An object containing the URL of the uploaded image.
   * @returns {void}
   */
  const uploadProfilePic = ({ url }) => {
    if (currentUser.photoURL !== defaultProfilePicUrl) {
      const photoRef = ref(storage, currentUser.photoURL);
      deleteObject(photoRef);
    }
    updateProfile(currentUser, { photoURL: url });
    let user = UserServices.getUser(currentUser.uid);
    user = { ...user, photo: url };
    UserServices.updateUser(currentUser.uid, user);
    setProfilePic(url);
    navigate(0);
  };

  /**
   * Preview selected image and store its URL to the state
   *
   * @function
   * @param {object} e - Event object
   * @returns {void}
   */
  const previewImage = (e) => {
    e.preventDefault();
    var file = e.target.files[0];
    setProfilePic(URL.createObjectURL(file));
  };

  /**
   * Handler for the click event of the "Add Image" button.
   *
   * @function
   * @param {Object} e - The click event object.
   * @returns {void}
   */
  const handleImageButton = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  /**
   * Handler for changing the username
   *
   * @function
   * @param {Object} e - The click event object.
   * @returns {void}
   */
  const handleNameChange = (e) => {
    const un = nameRef.current.value;
    updateProfile(currentUser, { displayName: un }).then(async () => {
      const newUser = {
        ...user,
        nickName: un,
      };
      await UserServices.updateUser(currentUser.uid, newUser);
      console.log("displayName updated: " + un);
    });
    setUserName(nameRef.current.value);
    navigate(0);
  };

  return (
    <div>
      <hr />
      <div className="m-auto h-screen border-gray-400 p-5 text-left sm:w-full sm:border-l-0 sm:border-r-0 md:w-2/3 md:border-l-2 md:border-r-2 lg:w-1/3">
        <h1 className="my-3 text-4xl font-bold">Informacion personal</h1>
        <hr />
        <div>
          <div className="float-left my-3 w-2/3">
            <div className="float-left w-1/2">
              Nombre:
              <div className="float-right w-8/12">
                {changing ? (
                  <div>
                    <input
                      name="nameChange"
                      id="1"
                      cols="12"
                      rows="1"
                      className="resize-none border-b-[1px] border-black outline-none"
                      maxLength="8"
                      ref={nameRef}
                    ></input>
                  </div>
                ) : (
                  <div className="h-4">{userName}</div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (changing && nameRef.current.value !== "") {
                handleNameChange();
              }
              isChanging(!changing);
            }}
            className="float-right my-3 w-1/3 text-center "
          >
            {changing ? (
              <span>Guardar Nombre</span>
            ) : (
              <span>Cambiar Nombre</span>
            )}
          </button>
        </div>
        <hr />
        <div className="float-left my-3 w-2/3 ">
          <div className="">Foto de usuario: </div>
          <Avatar
            className="m-3"
            alt="lol"
            src={profilePic}
            sx={{ height: 100, width: 100 }}
          />
        </div>
        <div className="float-right my-3 w-1/3 text-center">
          {image == null && (
            <button onClick={handleImageButton}>Cambiar foto</button>
          )}
          {image != null && (
            <div>
              <button onClick={handleUpload}>Subir foto</button>
              <span> | </span>
              <button onClick={handleImageButton}>Cambiar foto</button>
            </div>
          )}
        </div>

        <span className="float-left my-3 w-full ">
          E-mail: {currentUser.email}
        </span>

        <h1 className="my-3 mt-48 text-4xl font-bold">Seguridad</h1>
        <hr />

        <div>
          <div className="float-left my-3 w-2/3">Cambiar contraseña.</div>
          <input className="float-right my-3 w-1/3" />

          <div className="float-left my-3 w-2/3">Verificar Correo.</div>
          <div className="float-right my-3 w-1/3">
            {currentUser.emailVerified ? (
              <BsCheckLg />
            ) : (
              <GrAdd className="rotate-45 scale-150" />
            )}
          </div>

          <div className="float-left my-3 w-2/3 ">Eliminar cuenta</div>
          <button className="float-right my-3 w-1/3 text-red-500"> !!! </button>
        </div>
      </div>
      <input
        id="image"
        type="file"
        accept="image/*"
        ref={fileRef}
        className="absolute left-0 top-0 z-0 h-1 w-1 opacity-0"
        onChange={(event) => {
          setImage(event.target.files[0]);
          previewImage(event);
        }}
      />
    </div>
  );
};

export default Settings;
