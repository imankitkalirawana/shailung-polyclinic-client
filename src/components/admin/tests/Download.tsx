import { useEffect, useRef, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { Doctor, Report } from "../../../interface/interface";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { getDoctorsWithIds } from "../../../functions/get";
import { toast } from "sonner";
import { Font } from "@react-pdf/renderer";
import DynamicTable from "./DisplayReportTable";
import { Button, Kbd } from "@nextui-org/react";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Roboto-Light.ttf", fontWeight: "light" },
    { src: "/fonts/Roboto-Italic.ttf", fontStyle: "italic" },
  ],
});

// Header and Footer components
const Header = () => (
  <View style={styles.header}>
    <Image src={"/header-bar.jpg"} />
  </View>
);

interface FooterProps {
  reportId: string;
}

const Footer = ({ reportId }: FooterProps) => (
  <View style={styles.footer}>
    <Image src={"/footer-bar.jpg"} />
    <Image
      style={{
        position: "absolute",
        bottom: 37,
        right: 30,
        left: "86.63%",
        width: 70,
      }}
      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://report.shailungpolyclinic.com/report/${reportId}/download`}
    />
  </View>
);

interface MyDocumentProps {
  report: Report;
  reportRows: any[];
  doctors: Doctor[];
}

const MyDocument = ({ report, reportRows, doctors }: MyDocumentProps) => {
  return (
    <Document title={report.name} author={doctors[0].name}>
      {reportRows.map((row) => (
        <Page key={row._id} size="A4" style={styles.page}>
          <Image src="/logo.png" style={styles.background} />
          <Header />
          <View style={styles.main}>
            <View style={styles.flexSection}>
              <View style={styles.headerList}>
                <View style={styles.headerTitles}>
                  <Text style={styles.headerTitle}>Name :</Text>
                  <Text style={styles.headerTitle}>Address :</Text>
                  <Text style={styles.headerTitle}>Ref. By :</Text>
                  <Text style={styles.headerTitle}>Lab ID:</Text>
                </View>
                <View style={styles.headerTitles}>
                  <Text>{report.name || "-"}</Text>
                  <Text>{report?.address || "-"}</Text>
                  <Text>{report?.refby || "-"}</Text>
                  <Text>{report?.labId || "-"}</Text>
                </View>
              </View>
              <View style={styles.headerList}>
                <View style={styles.headerTitles}>
                  <Text style={styles.headerTitle}>Age/Sex :</Text>
                  <Text style={styles.headerTitle}>Report Date :</Text>
                  <Text style={styles.headerTitle}>Collection Date :</Text>
                  <Text style={styles.headerTitle}>Report ID:</Text>
                </View>
                <View style={styles.headerTitles}>
                  <Text>{`${report?.age} Yrs ${
                    report?.gender && `/${report.gender}`
                  }`}</Text>
                  <Text>{report?.reportDate || "-"}</Text>
                  <Text>{report?.collectiondate || "-"}</Text>
                  <Text>{report?._id.slice(0, 6)}</Text>
                </View>
              </View>
            </View>
            {/* Render the table here */}

            <View style={styles.section}>
              <View style={styles.formHeader}>
                <Text style={styles.headerTitle}>{row.testDetail.name}</Text>
                <Text>{row.testDetail.description}</Text>
              </View>
              {row._id && <DynamicTable tableid={row._id} />}
              <View style={styles.summary}>
                <Text>{row.testDetail.summary}</Text>
              </View>
              {/* doctors sign */}
              <View>
                <View
                  style={styles.doctors}
                  // minPresenceAhead={300}
                  wrap={false}
                >
                  {doctors.map((doctor) => (
                    <View key={doctor._id} style={styles.doctor}>
                      <Image
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                        }}
                        src={`${API_BASE_URL}/api/upload/single/${doctor.sign}`}
                      />
                      <Text>{doctor.name}</Text>
                      <Text>{doctor.designation}</Text>
                      <Text>{doctor.regno}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <Footer reportId={report._id} />
        </Page>
      ))}
    </Document>
  );
};

export default function Download() {
  const { reportId }: any = useParams();
  const [report, setReport] = useState<Report>({} as Report);
  const [reportRows, setReportRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/report/${reportId}`
        );
        const res = await axios.get(
          `${API_BASE_URL}/api/report/report-row/by-reportid/${data._id}`
        );
        const doctorsData = await getDoctorsWithIds(data.doctors);
        setReport(data);
        setReportRows(res.data);
        setDoctors(doctorsData);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch report");
        console.error(error);
      }
    };
    fetchReport();
  }, [reportId]);

  const downloadButtonRef = useRef<HTMLButtonElement | null>(null); // Add a ref for the button

  // click the download button when pressing cmd + p(on mac) or ctrl p(in windows)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault(); // Prevent default print dialog
        downloadButtonRef.current?.click(); // Trigger button click
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="mt-24">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex justify-center my-8">
            <PDFDownloadLink
              document={
                <MyDocument
                  report={report}
                  reportRows={reportRows}
                  doctors={doctors}
                />
              }
              fileName={`${report?.name}-${report?.reportDate}.pdf`}
            >
              {
                // @ts-ignore
                ({ blob, url, loading, error }) => (
                  <Button
                    ref={downloadButtonRef}
                    color={url ? "primary" : "default"}
                    variant={url ? "flat" : "light"}
                    isLoading={!url}
                    endContent={<Kbd keys={["command"]}>S</Kbd>}
                  >
                    {url ? "Download Report" : "Generating PDF"}
                  </Button>
                )
              }
            </PDFDownloadLink>
          </div>
          <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <MyDocument
              report={report}
              reportRows={reportRows}
              doctors={doctors}
            />
          </PDFViewer>
        </>
      )}
    </div>
  );
}

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontSize: 10,
    fontFamily: "Roboto",
    paddingBottom: 10,
  },
  row: { flexDirection: "row" },
  cell: { flex: 1, padding: 5, border: "1px solid #000" },
  background: {
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
    bottom: "20%",
    opacity: 0.05,
    aspectRatio: 1,
  },
  main: {
    paddingBottom: 50,
  },
  header: {
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    fontSize: 10,
  },
  flexSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    padding: 10,
  },
  headerList: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  headerTitles: {
    display: "flex",
    flexDirection: "column",
  },
  headerTitle: {
    fontWeight: "bold",
  },
  formHeader: {
    textAlign: "center",
  },
  formHeaderDescription: {
    fontSize: 10,
    textAlign: "center",
    whiteSpace: "no-wrap",
  },
  summary: {
    marginTop: 10,
  },
  doctors: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  doctor: {
    aspectRatio: 1,
    width: 135,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
