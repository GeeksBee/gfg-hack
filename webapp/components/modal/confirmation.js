import React from "react";
import OutsideClickHandler from "react-outside-click-handler/build/OutsideClickHandler";

const Confirmation = ({ text, setShowModal, onOk }) => {
  return (
    <div className="backdrop-blur-sm fixed h-screen w-full top-0 left-0 z-50 bg-black/[.3] flex justify-center items-center">
      <OutsideClickHandler onOutsideClick={() => setShowModal((prev) => !prev)}>
        <div className="bg-white border rounded-lg p-6 md:p-10 overflow-hidden">
          <div>{text}</div>
          <div className="flex justify-between mt-4">
            <button
              className="w-full mr-1 border-black border-2 rounded-md py-1 text-black"
              onClick={() => setShowModal((prev) => !prev)}
            >
              No
            </button>
            <button
              className="w-full mr-1 border-red-500 border-2 rounded-md py-1 text-red-500"
              onClick={() => onOk()}
            >
              Yes
            </button>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default Confirmation;
