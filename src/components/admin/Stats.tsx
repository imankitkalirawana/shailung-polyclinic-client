import {
  IconAdjustmentsHorizontal,
  IconTestPipe,
  IconX,
} from "@tabler/icons-react";
import Overview from "./Overview";
import { useEffect, useState } from "react";
import { humanReadableDate } from "./user/Users";
import { getTestStats } from "../../functions/post";

const timeframes = [
  {
    label: "1D",
    value: "1d",
  },
  {
    label: "7D",
    value: "7d",
  },
  {
    label: "1M",
    value: "1m",
  },
  {
    label: "3M",
    value: "3m",
  },
  {
    label: "6M",
    value: "6m",
  },
  {
    label: "1Y",
    value: "1y",
  },
];

const Stats = () => {
  const [timeframe, setTimeframe] = useState("1d");
  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState({} as any);
  const [previousData, setPreviousData] = useState({} as any);
  const fetchData = async () => {
    const response = await getTestStats(timeframe || "1d", startDate, endDate);
    const data = response.data;
    setData(data);
    const res2 = await getTestStats(
      timeframe || "",
      new Date(new Date().setDate(new Date().getDate() - 2)),
      new Date(new Date().setDate(new Date().getDate() - 1))
    );
    const data2 = res2.data;
    setPreviousData(data2);
  };
  useEffect(() => {
    fetchData();
  }, [timeframe, startDate, endDate]);

  const handleModalConfirm = () => {
    setModal(false);
  };

  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {startDate && endDate ? (
            <h2 className="text-2xl font-semibold">
              {humanReadableDate(startDate)} - {humanReadableDate(endDate)}
            </h2>
          ) : (
            <h2 className="text-2xl font-semibold">Last {timeframe} Stats</h2>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className={`btn btn-sm  ${modal ? "btn-primary" : "btn-outline"}`}
              onClick={() => setModal(!modal)}
            >
              <IconAdjustmentsHorizontal size={20} />
              Filter
            </button>
            {startDate && endDate ? (
              <div
                className="badge badge-primary"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              >
                <span className="">
                  {humanReadableDate(startDate)} - {humanReadableDate(endDate)}
                </span>
                <span className="n bg-base-100 text-primary ml-2 rounded-full">
                  <IconX size={16} stroke={2} />
                </span>
              </div>
            ) : null}
          </div>
          <div className="join justify-end">
            {timeframes.map((timeframe) => (
              <input
                key={timeframe.value}
                className="join-item btn btn-sm"
                type="radio"
                name="timeframe"
                aria-label={timeframe.label}
                value={timeframe.value}
                defaultChecked={timeframe.value === "1d"}
                onClick={(e) => {
                  setTimeframe(e.currentTarget.value);
                  setStartDate("");
                  setEndDate("");
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Overview
            timeframe={timeframe}
            starttime={startDate}
            endtime={endDate}
          />
          <div className="stats stats-vertical md:stats-horizontal shadow bg-base-300">
            <div className="stat">
              <div className="stat-figure text-primary">
                <IconTestPipe size={32} />
              </div>
              <div className="stat-title">Total Likes</div>
              <div className="stat-value text-primary">25.6K</div>
              <div className="stat-desc">21% more than last month</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Page Views</div>
              <div className="stat-value text-secondary">2.6M</div>
              <div className="stat-desc">21% more than last month</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="avatar online">
                  <div className="w-16 rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
              </div>
              <div className="stat-value">86%</div>
              <div className="stat-title">Tasks done</div>
              <div className="stat-desc text-secondary">31 tasks remaining</div>
            </div>
          </div>
        </div>
      </section>
      {modal && (
        <Modal
          setModal={setModal}
          onConfirm={handleModalConfirm}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      )}
    </>
  );
};

interface ModalProps {
  modal?: boolean;
  setModal: (modal: boolean) => void;
  onConfirm?: () => void;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

const Modal = ({
  setModal,
  onConfirm,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: ModalProps) => {
  return (
    <div className="modal backdrop-blur-lg modal-open">
      <div className="modal-box max-w-sm mx-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-lg">Filter</h3>
          <button
            className="btn btn-sm btn-circle shadow-lg justify-self-end"
            onClick={() => setModal(false)}
          >
            <IconX size={20} stroke={2} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              name="startDate"
              id="startDate"
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              value={startDate}
              min={startDate}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">End Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              name="endDate"
              id="endDate"
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              value={endDate}
              // validation to prevent selecting a date before the start date
              min={startDate}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="flex gap-2 items-center mt-4">
            <button
              className="btn w-full flex-1"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Reset
            </button>

            <button
              className="btn btn-primary w-full flex-1"
              onClick={() => {
                onConfirm && onConfirm();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
