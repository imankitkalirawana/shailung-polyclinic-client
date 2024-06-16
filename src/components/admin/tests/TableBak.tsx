import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";

const DynamicTable: React.FC = () => {
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);

  const generateInitialValues = (rows: number, cols: number) => {
    const initialValues: { [key: string]: string } = {};
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialValues[`cell-${row}-${col}`] = "";
      }
    }
    return initialValues;
  };

  const handleDeleteRow = (rowIndex: number, values: any, setValues: any) => {
    const newValues = { ...values };
    for (let col = 0; col < cols; col++) {
      delete newValues[`cell-${rowIndex}-${col}`];
    }

    // Adjust values for the remaining rows
    for (let row = rowIndex + 1; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newValues[`cell-${row - 1}-${col}`] = newValues[`cell-${row}-${col}`];
        delete newValues[`cell-${row}-${col}`];
      }
    }

    setRows(rows - 1);
    setValues(newValues);
  };

  const handleDeleteColumn = (
    colIndex: number,
    values: any,
    setValues: any
  ) => {
    const newValues = { ...values };
    for (let row = 0; row < rows; row++) {
      delete newValues[`cell-${row}-${colIndex}`];
    }

    for (let col = colIndex + 1; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        newValues[`cell-${row}-${col - 1}`] = newValues[`cell-${row}-${col}`];
        delete newValues[`cell-${row}-${col}`];
      }
    }

    setCols(cols - 1);
    setValues(newValues);
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/service`, {
        data: values,
      });
      toast.success("Data submitted successfully");
      console.log("Data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Formik
      initialValues={generateInitialValues(rows, cols)}
      onSubmit={(values) => {
        handleSubmit(values);
        console.log("Form data", values);
      }}
    >
      {({ values, setValues }) => (
        <Form>
          <table>
            <thead>
              <tr>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <th key={colIndex}>
                    Column {colIndex + 1}
                    <Button
                      onClick={() =>
                        handleDeleteColumn(colIndex, values, setValues)
                      }
                    >
                      Delete
                    </Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: cols }).map((_, colIndex) => (
                    <td key={colIndex}>
                      <Field
                        className="input input-bordered"
                        name={`cell-${rowIndex}-${colIndex}`}
                      />
                    </td>
                  ))}
                  <td>
                    <Button
                      onClick={() =>
                        handleDeleteRow(rowIndex, values, setValues)
                      }
                    >
                      Delete Row {rowIndex + 1}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Button
              type="button"
              onClick={() => {
                setCols(cols + 1);
              }}
            >
              Add Column
            </Button>
            <Button
              type="button"
              onClick={() => {
                setRows(rows + 1);
              }}
            >
              Add Row
            </Button>
          </div>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default DynamicTable;
