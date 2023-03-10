import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * @deprecated
 * @component
 * React component for rendering a back button that navigates to the previous page using React Router.
 *
 * @function
 * @name BackButton
 *
 * @returns {JSX.Element} The rendered React element representing the back button.
 *
 * @requires react
 * @requires react-router-dom
 */
function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="fixed">
      <button
        className="button-still text-3xl"
        onClick={() => navigate(-1)}
      ></button>
    </div>
  );
}

export default BackButton;
