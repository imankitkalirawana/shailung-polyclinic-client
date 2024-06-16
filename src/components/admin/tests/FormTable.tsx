import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Tooltip } from "@nextui-org/react";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { IconPlus, IconX } from "@tabler/icons-react";

interface FormTableProps {
  tableid?: string;
  onSubmit?: (values: any) => void;
  rowCount?: number;
  colCount?: number;
}

const FormTable = ({
  tableid,
  onSubmit,
  rowCount,
  colCount,
}: FormTableProps) => {
  const [rows, setRows] = useState<number>(rowCount || 3);
  const [cols, setCols] = useState<number>(colCount || 3);
  const [initialValues, setInitialValues] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/service/${tableid}`
        );
        const data = response.data.data;

        // Determine the number of rows and columns based on the data
        const rowCount =
          Math.max(
            ...Object.keys(data).map((key) => parseInt(key.split("-")[1]))
          ) + 1;
        const colCount =
          Math.max(
            ...Object.keys(data).map((key) => parseInt(key.split("-")[2]))
          ) + 1;

        setRows(rowCount);
        setCols(colCount);
        setInitialValues(data);

        console.log("Data fetched successfully:", response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      }
    };
    {
      tableid && fetchData();
    }
  }, [tableid]);

  const handleDeleteRow = (rowIndex: number, values: any, setValues: any) => {
    const newValues = { ...values };
    for (let col = 0; col < cols; col++) {
      delete newValues[`cell-${rowIndex}-${col}`];
    }

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

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        onSubmit && onSubmit(values);
        console.log("Form data", values);
      }}
    >
      {({ values, setValues }) => (
        <Form className="overflow-x-scroll">
          <div className="flex justify-end mr-[72px]">
            <Tooltip content="Add new Column" color="primary">
              <Button
                type="button"
                onClick={() => {
                  setCols(cols + 1);
                  setInitialValues({
                    ...initialValues,
                    [`cell-${rows}-${cols}`]: "",
                  });
                }}
                isIconOnly
                radius="full"
                color="primary"
                variant="flat"
              >
                <IconPlus size={16} />
              </Button>
            </Tooltip>
          </div>
          <table className="table">
            <thead>
              <tr>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <th className="text-center" key={colIndex}>
                    {cols > 1 && (
                      <Button
                        onClick={() =>
                          handleDeleteColumn(colIndex, values, setValues)
                        }
                        isIconOnly
                        radius="full"
                        color="danger"
                        variant="light"
                      >
                        <IconX size={16} />
                      </Button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="g group">
                  {Array.from({ length: cols }).map((_, colIndex) => (
                    <td className="p-1" key={colIndex}>
                      <Field
                        as="textarea"
                        className="textarea textarea-bordered h-full w-full"
                        name={`cell-${rowIndex}-${colIndex}`}
                      />
                    </td>
                  ))}
                  <td className="w-[40px] transition-all opacity-0 group-hover:opacity-100">
                    {rows > 2 && rowIndex !== 0 && (
                      <Tooltip content="Delete Row" color="danger">
                        <Button
                          onClick={() =>
                            handleDeleteRow(rowIndex, values, setValues)
                          }
                          isIconOnly
                          radius="full"
                          color="danger"
                          variant="flat"
                        >
                          <IconX size={16} />
                        </Button>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mr-[72px]">
            <Tooltip content="Add new Row" color="primary">
              <Button
                type="button"
                onClick={() => {
                  setRows(rows + 1);
                  setInitialValues({
                    ...initialValues,
                    [`cell-${rows}-${cols}`]: "",
                  });
                }}
                isIconOnly
                radius="full"
                color="primary"
                variant="flat"
              >
                <IconPlus size={16} />
              </Button>
            </Tooltip>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormTable;
