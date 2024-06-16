import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";

interface DynamicTableProps {
  tableid?: string;
}

const DynamicTable = ({ tableid }: DynamicTableProps) => {
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);
  const [data, setData] = useState<{ [key: string]: string }>({});

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
        setData(data);
        console.log("Data fetched successfully:", response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      }
    };
    if (tableid) {
      fetchData();
    }
  }, [tableid]);

  const renderTableHead = () => {
    const headers = [];
    for (let col = 0; col < cols; col++) {
      const cellKey = `cell-0-${col}`;
      headers.push(<th key={cellKey}>{data[cellKey] || ""}</th>);
    }
    return <tr>{headers}</tr>;
  };

  const renderTableBody = () => {
    const bodyRows = [];
    for (let row = 1; row < rows; row++) {
      // Start from row 1 as row 0 is used for headers
      const rowData = [];
      for (let col = 0; col < cols; col++) {
        const cellKey = `cell-${row}-${col}`;
        rowData.push(<td key={cellKey}>{data[cellKey] || ""}</td>);
      }
      bodyRows.push(<tr key={row}>{rowData}</tr>);
    }
    return bodyRows;
  };

  return (
    <div>
      <table className="table">
        <thead>{renderTableHead()}</thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
