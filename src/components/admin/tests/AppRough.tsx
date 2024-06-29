import React, { useState } from "react";
import Rough from "./rough";
import FormTable from "./FormTable";

const RoughApp: React.FC = () => {
  const [formData, setFormData] = useState<{ [key: string]: any }[]>([]); // State to hold form data

  const formids = ["form1", "form2", "form3"];
  console.log(formData);

  // Handle form data change from child component
  const handleDataChange = (values: { [key: string]: any }, formid: string) => {
    // Update or add form data in state based on formid
    setFormData((prevData) => {
      const updatedData = [...prevData];
      const dataIndex = updatedData.findIndex((data) => data.formid === formid);

      if (dataIndex !== -1) {
        updatedData[dataIndex] = { ...values, formid };
      } else {
        updatedData.push({ ...values, formid });
      }

      return updatedData;
    });
  };

  const handleGetData = () => {
    console.log(formData);
  };

  return (
    <div className="mt-24">
      {formids.map((formid, index) => (
        <Rough key={index} formid={formid} onDataChange={handleDataChange} />
      ))}
      <FormTable onDataChange={handleDataChange} />
      <div className="flex items-center justify-between mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleGetData}
        >
          Get data
        </button>
        <div className="max-w-sm">
          <span>Data:</span>
          {formData.map((data, index) => (
            <div key={index}>{JSON.stringify(data)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoughApp;
