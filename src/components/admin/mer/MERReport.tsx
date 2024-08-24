import { useEffect, useState } from "react";
import { isLoggedIn } from "../../../utils/auth";
import { MER as Report } from "../../../interface/interface";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllMER } from "../../../functions/get";
import {
  Button,
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
  IconArrowUpRight,
  IconDotsVertical,
  IconPencil,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { humanReadableDate } from "../user/Users";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../../utils/config";

const MERReport = () => {
  const { loggedIn, user } = isLoggedIn();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUrl = location.pathname;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const deleteReportModal = useDisclosure();

  useEffect(() => {
    if (
      !loggedIn ||
      (user?.role !== "admin" &&
        user?.role !== "doctor" &&
        user?.role !== "recp")
    ) {
      window.location.href = `/auth/login?redirect=${currentUrl}`;
    }
  }, [currentUrl]);
  const fetchData = async () => {
    const data = await getAllMER();
    setReports(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  // @ts-ignore
  const handleSearch = (report: Report) => {
    if (
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.passportNumber &&
        report.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return true;
    }
    return false;
  };

  const handleDelete = async () => {
    if (selected) {
      await axios.delete(`${API_BASE_URL}/api/mer/${selected._id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      deleteReportModal.onClose();
      toast.success("Report deleted successfully");
      fetchData();
    }
  };

  return (
    <>
      <div className="mx-auto">
        <div className="w-full card shadow-xs">
          <div className="flex justify-between items-center">
            <h1 className="my-6 text-2xl font-semibold">Reports</h1>
            <Button
              as={Link}
              to={`/dashboard/medical-examination/new`}
              variant="flat"
              color="primary"
            >
              <span>New Report</span>
            </Button>
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
            aria-label="Medical Examination Reports"
            onRowAction={(key) => {
              navigate(`/dashboard/medical-examination/${key}`);
            }}
            selectionMode="single"
          >
            <TableHeader>
              <TableColumn key={"name"}>Name</TableColumn>
              <TableColumn key={"age"}>Age</TableColumn>
              <TableColumn key={"phone"}>Applied Country</TableColumn>
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
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.age}</TableCell>
                  <TableCell>{report.appliedCountry}</TableCell>
                  <TableCell>{report.addedby || "-"}</TableCell>
                  <TableCell>{humanReadableDate(report.createdAt)}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="light"
                          radius="full"
                          size="sm"
                          isIconOnly
                        >
                          <IconDotsVertical size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Actions">
                        <DropdownItem
                          startContent={<IconArrowUpRight size={16} />}
                          key="view"
                          onClick={() => {
                            navigate(
                              `/dashboard/medical-examination/${report._id}`
                            );
                          }}
                        >
                          View
                        </DropdownItem>
                        <DropdownItem
                          startContent={<IconPencil size={16} />}
                          key="edit"
                          onClick={() => {
                            navigate(
                              `/dashboard/medical-examination/${report._id}/edit`
                            );
                          }}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          className="text-danger"
                          color="danger"
                          startContent={<IconTrash size={16} />}
                          key="delete"
                          onClick={() => {
                            setSelected(report);
                            deleteReportModal.onOpenChange();
                          }}
                        >
                          Delete
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
      <Modal
        isOpen={deleteReportModal.isOpen}
        onOpenChange={deleteReportModal.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p>Are you sure you want to delete {selected?.name}</p>
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
                  onPress={handleDelete}
                  fullWidth
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MERReport;
