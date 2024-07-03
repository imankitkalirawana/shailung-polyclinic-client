import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Tooltip } from "@nextui-org/react";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { IconPlus, IconX } from "@tabler/icons-react";
import ReactQuill from "react-quill";

interface FormTableProps {
  tableid?: string;
  onDataChange: (values: { [key: string]: any }, formid: string) => void;
  rowCount?: number;
  colCount?: number;
  isHidden?: boolean;
}

const FormTable = ({
  tableid,
  onDataChange,
  rowCount,
  colCount,
  isHidden,
}: FormTableProps) => {
  const [rows, setRows] = useState<number>(rowCount || 1);
  const [cols, setCols] = useState<number>(colCount || 1);
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
        if (rowCount === -Infinity) {
          setRows(2);
        } else {
          setRows(rowCount);
        }
        if (colCount === -Infinity) {
          setCols(2);
        } else {
          setCols(colCount);
        }
        setInitialValues(data);
        onDataChange(data, tableid || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      }
    };
    {
      if (tableid) {
        fetchData();
      }
    }
  }, [tableid]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues,
    },
    onSubmit: () => {},
  });

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

  const handleAddRow = (rowIndex: number, values: any, setValues: any) => {
    const newValues = { ...values };
    for (let row = rows; row > rowIndex; row--) {
      for (let col = 0; col < cols; col++) {
        newValues[`cell-${row}-${col}`] = newValues[`cell-${row - 1}-${col}`];
      }
    }

    for (let col = 0; col < cols; col++) {
      newValues[`cell-${rowIndex}-${col}`] = "";
    }

    setRows(rows + 1);
    setValues(newValues);
  };

  const handleAddColumn = (colIndex: number, values: any, setValues: any) => {
    const newValues = { ...values };
    for (let col = cols; col > colIndex; col--) {
      for (let row = 0; row < rows; row++) {
        newValues[`cell-${row}-${col}`] = newValues[`cell-${row}-${col - 1}`];
      }
    }

    for (let row = 0; row < rows; row++) {
      newValues[`cell-${row}-${colIndex}`] = "";
    }
    setCols(cols + 1);
    setValues(newValues);
  };

  // initially send the form data to parent component

  return (
    <form onSubmit={formik.handleSubmit} className="overflow-x-scroll">
      <div className={`flex justify-end mr-[72px] ${isHidden && "hidden"}`}>
        <Tooltip
          size="sm"
          placement="left"
          content="Add Column (Right)"
          color="primary"
          showArrow
        >
          <Button
            size="sm"
            type="button"
            isIconOnly
            radius="full"
            color="primary"
            variant="flat"
            onClick={() =>
              handleAddColumn(cols, formik.values, formik.setValues)
            }
          >
            <IconPlus size={16} />
          </Button>
        </Tooltip>
      </div>
      <table className={`table ${isHidden && "hidden"}`}>
        <thead>
          <tr className="border-y-0">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <th className="text-center" key={colIndex}>
                <div className="flex flex-row-reverse justify-between">
                  {cols > 1 && (
                    <Tooltip
                      className="justify-self-center"
                      content="Delete Column"
                      color="danger"
                      size="sm"
                      showArrow
                    >
                      <Button
                        onClick={() =>
                          handleDeleteColumn(
                            colIndex,
                            formik.values,
                            formik.setValues
                          )
                        }
                        isIconOnly
                        radius="full"
                        color="danger"
                        variant="light"
                        size="sm"
                      >
                        <IconX size={16} />
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip
                    content="Add Column (Left)"
                    size="sm"
                    color="primary"
                    showArrow
                  >
                    <Button
                      onClick={() =>
                        handleAddColumn(
                          colIndex,
                          formik.values,
                          formik.setValues
                        )
                      }
                      isIconOnly
                      radius="full"
                      color="primary"
                      variant="light"
                      size="sm"
                    >
                      <IconPlus size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="group border-y-0">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td className="p-1" key={colIndex}>
                  {/* <textarea
                    className="textarea textarea-bordered h-[50px] w-full"
                    name={`cell-${rowIndex}-${colIndex}`}
                    value={formik.values[`cell-${rowIndex}-${colIndex}`] || ""}
                    onChange={(e) => {
                      // @ts-ignore
                      handleInputChange(e);
                    }}
                  /> */}
                  <ReactQuill
                    theme="snow"
                    value={formik.values[`cell-${rowIndex}-${colIndex}`] || ""}
                    onChange={
                      // @ts-ignore
                      (value) => {
                        formik.setFieldValue(
                          `cell-${rowIndex}-${colIndex}`,
                          value
                        );
                        onDataChange(formik.values, tableid || "");
                      }
                    }
                    formats={["bold", "italic", "underline", "strike"]}
                  />
                </td>
              ))}
              <td className="w-[40px] transition-all opacity-0 group-hover:opacity-100">
                <div className="flex gap-1 flex-col-reverse items-center">
                  {rows > 1 && (
                    <Tooltip
                      content="Delete Row"
                      placement="left"
                      color="danger"
                      size="sm"
                      showArrow
                    >
                      <Button
                        onClick={() =>
                          handleDeleteRow(
                            rowIndex,
                            formik.values,
                            formik.setValues
                          )
                        }
                        isIconOnly
                        radius="full"
                        color="danger"
                        variant="light"
                        size="sm"
                      >
                        <IconX size={16} />
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip
                    content="Add Row (Above)"
                    placement="left"
                    color="primary"
                    size="sm"
                    showArrow
                  >
                    <Button
                      onClick={() =>
                        handleAddRow(rowIndex, formik.values, formik.setValues)
                      }
                      isIconOnly
                      radius="full"
                      color="primary"
                      variant="light"
                      size="sm"
                    >
                      <IconPlus size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`flex justify-end mr-[72px] ${isHidden && "hidden"}`}>
        <Tooltip
          size="sm"
          placement="left"
          content="Add Row (Below)"
          color="primary"
          showArrow
        >
          <Button
            type="button"
            isIconOnly
            radius="full"
            color="primary"
            variant="flat"
            size="sm"
            onClick={() => handleAddRow(rows, formik.values, formik.setValues)}
          >
            <IconPlus size={16} />
          </Button>
        </Tooltip>
      </div>
      {/* <div className="flex justify-end gap-4 mt-4">
        {onSecondarySubmit && (
          <Button
            variant="bordered"
            type="button"
            onPress={() => {
              onSecondarySubmit(formik.values);
            }}
            isLoading={isDrafting}
            isDisabled={isDrafting}
          >
            Save Draft
          </Button>
        )}
        <Button
          variant="flat"
          color="primary"
          type="submit"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Submit
        </Button>
      </div> */}
    </form>
  );
};

export default FormTable;
