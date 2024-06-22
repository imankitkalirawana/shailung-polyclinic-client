import { useEffect, useState } from "react";
import { humanReadableDate } from "../user/Users";
import { getAllReports } from "../../../functions/get";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { toast } from "sonner";
import { isLoggedIn } from "../../../utils/auth";
import { Report } from "../../../interface/interface";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {
  IconDotsVertical,
  IconDownload,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";

const Reports = () => {
  const { loggedIn, user } = isLoggedIn();
  const location = useLocation();
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selected, setSelected] = useState<Report | null>(null);
  const currentUrl = location.pathname;
  const navigate = useNavigate();
  const deleteReportModal = useDisclosure();

  useEffect(() => {
    if (!loggedIn) {
      window.location.href = `/auth/login?redirect=${currentUrl}`;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllReports();
      setReports(data);
    };
    fetchData();
  }, []);

  const handleSearch = (report: Report) => {
    if (
      (report.name &&
        report.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.phone &&
        report.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.testname &&
        report.testname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.status &&
        report.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.addedby &&
        report.addedby.toLowerCase().includes(searchQuery.toLowerCase())) ||
      humanReadableDate(report.reportDate)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return report;
    }
  };

  return (
    <>
      <div className="mx-auto">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="my-6 text-2xl font-semibold">Reports</h1>
          </div>
          <div className="relative w-full max-w-md mb-4">
            <Input
              type="text"
              placeholder="Search by name, phone, test, status"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              endContent={<IconSearch size={16} />}
            />
          </div>

          <Table
            topContent={
              <span className="text-default-400 text-small">
                Total {reports.length} reports
              </span>
            }
            aria-label="Reports"
            onRowAction={(key) => {
              navigate(`/report/${key}/download`);
            }}
            selectionMode="single"
          >
            <TableHeader>
              <TableColumn key={"status"}>Status</TableColumn>
              <TableColumn key={"testname"}>Test Name</TableColumn>
              <TableColumn key={"patientname"}>Name</TableColumn>
              <TableColumn key={"phone"}>Phone</TableColumn>
              <TableColumn key={"addedby"}>Added By</TableColumn>
              <TableColumn key={"date"}>Date</TableColumn>
              <TableColumn key={"actions"}>Actions</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={"No Report Available"}
              items={reports.filter((report) => handleSearch(report))}
            >
              {(report: Report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <Chip
                      variant="dot"
                      color={
                        report.status === "positive"
                          ? "success"
                          : report.status === "negative"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {report.status}
                    </Chip>
                  </TableCell>
                  <TableCell>{report.testname}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.phone}</TableCell>
                  <TableCell>{report.addedby}</TableCell>
                  <TableCell>{humanReadableDate(report.reportDate)}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="light"
                          isIconOnly
                          radius="full"
                          aria-label="Actions"
                          size="sm"
                        >
                          <IconDotsVertical size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Report Actions">
                        <DropdownItem
                          key="download"
                          startContent={<IconDownload size={16} />}
                          onClick={() => {
                            navigate(`/report/${report._id}/download`);
                          }}
                          textValue="Download Report"
                        >
                          Download Report
                        </DropdownItem>
                        <DropdownItem
                          className={`text-danger ${
                            user?.role === "admin" ? "" : "hidden"
                          }`}
                          key="delete"
                          color="danger"
                          startContent={<IconTrash size={16} />}
                          onClick={() => {
                            setSelected(report);
                            deleteReportModal.onOpenChange();
                          }}
                          textValue="Delete Test"
                        >
                          Delete Test
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selected && (
        <DeleteModal
          report={selected}
          deleteReportModal={deleteReportModal}
          setReports={setReports}
        />
      )}
    </>
  );
};

interface DeleteModalProps {
  report: Report;
  setReports: any;
  deleteReportModal: any;
}

const DeleteModal = ({
  report,
  setReports,
  deleteReportModal,
}: DeleteModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/report/${report._id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      await axios.put(
        `${API_BASE_URL}/api/test/undone/${report.testid}`,
        null,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await getAllReports();
      setReports(data);
      deleteReportModal.onClose();
      toast.success("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={deleteReportModal.isOpen}
      onOpenChange={deleteReportModal.onOpenChange}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <p>
                Are you sure you want to delete {report.name}'s report for{" "}
                {report.testname}
              </p>
            </ModalHeader>
            <ModalBody></ModalBody>
            <ModalFooter className="flex-col-reverse sm:flex-row">
              <Button
                color="default"
                fullWidth
                variant="flat"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                variant="flat"
                fullWidth
                onPress={() => {
                  handleDelete();
                }}
                isLoading={loading}
                isDisabled={loading}
              >
                Delete Report
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Reports;
