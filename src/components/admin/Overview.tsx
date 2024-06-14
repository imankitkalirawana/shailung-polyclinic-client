import { useEffect, useState } from "react";
import { getTestStats } from "../../functions/post";
import {
  IconArrowDown,
  IconArrowUp,
  IconChartLine,
  IconReservedLine,
} from "@tabler/icons-react";
import { Card } from "@nextui-org/react";

interface Props {
  timeframe?: string;
  starttime?: any;
  endtime?: any;
}

const Overview = ({ timeframe, starttime, endtime }: Props) => {
  const [data, setData] = useState({} as any);
  const [previousData, setPreviousData] = useState({} as any);
  const fetchData = async () => {
    const response = await getTestStats(timeframe || "1d", starttime, endtime);
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
  }, [timeframe, starttime, endtime]);

  //   calculate the percentage change
  const calculatePercentage = (current: number, previous: number) => {
    const percentage = (((current - previous) / previous) * 100).toFixed(2);
    // if percentage is infinity or NaN return 0
    if (percentage === "Infinity" || percentage === "NaN") {
      return "0";
    }
    return percentage;
  };
  return (
    <>
      <Card
        className="stats md:flex-row stats-vertical md:stats-horizontal"
        shadow="lg"
      >
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconReservedLine size={32} />
          </div>
          <div className="stat-title">Expected Revenue</div>
          <div className={`stat-value text-primary`}>
            {parseInt(data.totalRevenue).toLocaleString()}
          </div>
          {!(starttime && endtime) && timeframe === "1d" && (
            <div
              className={`stat-desc flex-nowrap flex ${
                parseFloat(
                  calculatePercentage(
                    data.totalRevenue,
                    previousData.totalRevenue
                  )
                ) > 0
                  ? "text-success flex items-center"
                  : parseFloat(
                      calculatePercentage(
                        data.totalRevenue,
                        previousData.totalRevenue
                      )
                    ) === 0
                  ? ""
                  : "text-error"
              }`}
            >
              {calculatePercentage(
                data.totalRevenue,
                previousData.totalRevenue
              )}
              %
              {parseFloat(
                calculatePercentage(
                  data.totalRevenue,
                  previousData.totalRevenue
                )
              ) > 0 ? (
                <IconArrowUp size={16} />
              ) : parseFloat(
                  calculatePercentage(
                    data.totalRevenue,
                    previousData.totalRevenue
                  )
                ) === 0 ? (
                ""
              ) : (
                <IconArrowDown size={16} />
              )}
            </div>
          )}
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconChartLine size={32} />
          </div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-secondary">
            {parseInt(data.revenue).toLocaleString()}
          </div>
          {!(starttime && endtime) && timeframe === "1d" && (
            <div
              className={`stat-desc flex ${
                parseFloat(
                  calculatePercentage(data.revenue, previousData.revenue)
                ) > 0
                  ? "text-success"
                  : parseFloat(
                      calculatePercentage(data.revenue, previousData.revenue)
                    ) == 0
                  ? ""
                  : "text-error"
              }`}
            >
              {calculatePercentage(data.revenue, previousData.revenue)}%
              {parseFloat(
                calculatePercentage(data.revenue, previousData.revenue)
              ) > 0 ? (
                <IconArrowUp size={16} />
              ) : parseFloat(
                  calculatePercentage(data.revenue, previousData.revenue)
                ) === 0 ? (
                ""
              ) : (
                <IconArrowDown size={16} />
              )}
            </div>
          )}
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
          </div>
          <div className="stat-title">Users Registered</div>
          <div className="stat-value">{data.userCount}</div>
          {!(starttime && endtime) && timeframe === "1d" ? (
            <div
              className={`stat-desc ${
                parseFloat(
                  calculatePercentage(data.userCount, previousData.userCount)
                ) > 0
                  ? "text-success"
                  : parseFloat(
                      calculatePercentage(
                        data.userCount,
                        previousData.userCount
                      )
                    ) === 0
                  ? ""
                  : "text-error"
              }`}
            >
              {calculatePercentage(data.userCount, previousData.userCount)}%
              {parseFloat(
                calculatePercentage(data.userCount, previousData.userCount)
              ) > 0 ? (
                <IconArrowUp size={16} />
              ) : parseFloat(
                  calculatePercentage(data.userCount, previousData.userCount)
                ) === 0 ? (
                ""
              ) : (
                <IconArrowDown size={16} />
              )}
            </div>
          ) : null}
        </div>
      </Card>
    </>
  );
};

export default Overview;
