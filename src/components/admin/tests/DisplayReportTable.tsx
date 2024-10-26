import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import Html from "react-pdf-html";
import ReactDOMServer from "react-dom/server";
import parse, { HTMLReactParserOptions, domToReact } from "html-react-parser";

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
          `${API_BASE_URL}/api/report/report-row/${tableid}`
        );
        let data = response.data.data;
        delete data["formid"];

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
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      }
    };
    if (tableid) {
      fetchData();
    }
  }, [tableid]);

  // Custom parser options to selectively style <strong>, <p>, and <i> tags
  const customParserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode.type === "tag") {
        if (domNode.name === "strong") {
          return (
            <strong
              style={{
                fontWeight: "bold",
                whiteSpace: "pre-wrap",
                fontSize: "10px",
              }}
            >
              {
                // @ts-ignore
                domToReact(domNode.children)
              }
            </strong>
          );
        }
        if (domNode.name === "p") {
          return (
            <p style={{ fontSize: "10px", whiteSpace: "pre-wrap", margin: 0 }}>
              {
                // @ts-ignore
                domToReact(domNode.children)
              }
            </p>
          );
        }
        if (domNode.name === "i") {
          return (
            <i style={{ fontStyle: "italic", fontSize: "10px" }}>
              {
                // @ts-ignore
                domToReact(domNode.children)
              }
            </i>
          );
        }
      }
    },
  };

  const renderTableHead = () => {
    const headers = [];
    for (let col = 0; col < cols; col++) {
      const cellKey = `cell-0-${col}`;
      headers.push(
        <th key={cellKey} className="p-0" style={{ fontSize: "12px" }}>
          {parse(data[cellKey] || "", customParserOptions)}
        </th>
      );
    }
    return <tr className="border-b border-slate-300">{headers}</tr>;
  };

  const renderTableBody = () => {
    const bodyRows = [];
    for (let row = 1; row < rows; row++) {
      const rowData = [];
      for (let col = 0; col < cols; col++) {
        const cellKey = `cell-${row}-${col}`;
        rowData.push(
          <td
            key={cellKey}
            className="whitespace-pre-line p-0"
            style={{ fontSize: "12px" }}
          >
            {parse(data[cellKey] || "", customParserOptions)}
          </td>
        );
      }
      bodyRows.push(
        <tr className="border-y border-slate-300" key={row}>
          {rowData}
        </tr>
      );
    }
    return bodyRows;
  };

  const element = (
    <table className="table-auto">
      <thead>{renderTableHead()}</thead>
      <tbody>{renderTableBody()}</tbody>
    </table>
  );

  const html = ReactDOMServer.renderToStaticMarkup(element);

  const stylesheet = {
    table: {
      fontSize: 10,
    },
    // add bottom border to table head
    // th: {
    //   borderBottom: "0.2px solid #0000005a",
    // },
    tr: {
      borderBottom: "0.2px solid #0000005a",
      paddingTop: 3,
      paddingBottom: 3,
    },
  };

  return <Html stylesheet={stylesheet}>{html}</Html>;
};

export default DynamicTable;
