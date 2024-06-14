import React from "react";
import { FaceErrorIcon } from "./icons/Icons";

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  return (
    <div className="flex flex-col mt-4 items-center justify-center">
      <FaceErrorIcon className="h-48 w-48" />
      <h3 className="text-xl">{message}</h3>
    </div>
  );
};

export default NotFound;
