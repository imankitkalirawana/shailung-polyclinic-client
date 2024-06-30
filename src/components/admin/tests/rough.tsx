import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Rough = () => {
  const [value, setValue] = useState("hello");
  return (
    <ReactQuill>
      <div className="input input-bordered"></div>
    </ReactQuill>
  );
};

export default Rough;
