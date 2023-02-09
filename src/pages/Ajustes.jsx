import React, { useState, useRef, useEffect } from "react";
import { auth } from "../api/firebase-config";
import { BsCheckLg } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { Modal, Box, Avatar } from "@mui/material";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../api/firebase-config";
import { v4 } from "uuid";
import { updateProfile } from "firebase/auth";
import userServices from "../api/user.services";

const Settings = () => {
  const currentUser = auth.currentUser;
  const defaultProfilePicUrl =
    "https://firebasestorage.googleapis.com/v0/b/j1web-7dc6e.appspot.com/o/profilePics%2Fdefault%2Fblank-profile-picture-973460_1280.webp?alt=media&token=4196e70b-dbb5-4ca6-8526-9169a854635a";
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [profilePic, setProfilePic] = useState(currentUser.photoURL);
  const imgRef = useRef(null);

  useEffect(() => {
    console.log(currentUser);
  }, []);

  const handleSelected = (e) => {
    e.preventDefault();
    setSelected(e.target.id);
  };

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
    imgRef.current.value = null;
  };

  const uploadProfilePic = ({ url }) => {
    if (currentUser.photoURL !== defaultProfilePicUrl) {
      const photoRef = ref(storage, currentUser.photoURL);
      deleteObject(photoRef);
    }
    updateProfile(currentUser, { photoURL: url });
    let user = userServices.getUser(currentUser.uid);
    user = { ...user, photo: url };
    userServices.updateUser(currentUser.uid, user);
    setProfilePic(url);
  };

  const renderSelected = () => {
    switch (selected) {
      case "informacion":
        return (
          <div className="text-left">
            <div className="float-left w-2/3 ">
              Nombre: {currentUser.displayName}
            </div>
            <button className="float-right w-1/3 ">Cambiar nombre</button>

            <div className="float-left my-3 w-2/3 ">
              <div className="">Foto de usuario: </div>
              <Avatar
                className=" ml-3"
                alt="lol"
                src={profilePic}
                sx={{ height: 100, width: 100 }}
              />
            </div>
            {image == null && (
              <button
                className="float-right my-3 w-1/3 "
                onClick={() => {
                  setOpen(!open);
                }}
              >
                Cambiar foto
              </button>
            )}
            {image != null && (
              <button className="float-right w-1/3 " onClick={handleUpload}>
                Subir foto
              </button>
            )}

            <div className="float-left w-2/3 ">E-mail: {currentUser.email}</div>

            <Modal
              open={open}
              onClose={() => {
                setOpen(!open);
              }}
            >
              <Box className="mx-auto my-72 h-64 w-1/2 bg-white text-center ">
                <input
                  type="file"
                  ref={imgRef}
                  className="h-full w-full"
                  onChange={(event) => {
                    setImage(event.target.files[0]);
                  }}
                />
              </Box>
            </Modal>
          </div>
        );
      case "seguridad":
        return (
          <div>
            <div className="float-left w-2/3 ">Cambiar contraseña.</div>
            <input className="float-right w-1/3 " />

            <div className="float-left w-2/3 ">Verificar Correo.</div>
            <div className="float-right w-1/3">
              {currentUser.emailVerified ? (
                <BsCheckLg />
              ) : (
                <GrAdd className="rotate-45 scale-150" />
              )}
            </div>

            <div className="float-left w-2/3 ">Eliminar cuenta</div>
            <button className="float-right w-1/3 text-red-500"> !!! </button>
          </div>
        );
      case "???":
        return <div>jejejje</div>;
      case "aspecto":
        return <div>jijjiji</div>;
      default:
        setSelected("informacion");
    }
  };

  return (
    <div>
      <hr />
      <div className="float-right h-screen w-1/4 border-r-2 p-5 text-justify">
        <ul className="text-3xl">
          <li className="button py-2">
            <button onClick={handleSelected} id="informacion">
              Información personal
            </button>
          </li>
          <li className="button py-2">
            <button onClick={handleSelected} id="seguridad">
              Seguridad
            </button>
          </li>
          <li className="button py-2">
            <button onClick={handleSelected} id="???">
              ????
            </button>
          </li>
          <li className="button py-2">
            <button onClick={handleSelected} id="aspecto">
              Aspecto
            </button>
          </li>
        </ul>
      </div>
      <div className="m-auto w-fit p-10 text-left text-lg">
        {renderSelected()}
      </div>
    </div>
  );
};

export default Settings;
