import React from "react";
import { useFormik } from "formik";

interface RoughProps {
  formid?: string;
  onDataChange: (values: { [key: string]: any }, formid: string) => void; // Callback function to pass data to parent
}

const Rough: React.FC<RoughProps> = ({ formid, onDataChange }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    onSubmit: () => {}, // Remove onSubmit as we don't need individual submits
  });

  // Handle form data changes and pass to parent
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value);
    onDataChange(formik.values, formid || "");
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        name="name"
        id={`name-${formid}`}
        className="input input-bordered"
        onChange={handleInputChange}
        value={formik.values.name}
      />
      <input
        type="text"
        name="email"
        id={`email-${formid}`}
        className="input input-bordered"
        onChange={handleInputChange}
        value={formik.values.email}
      />
    </div>
  );
};

export default Rough;
