import { MERAppointment } from "../../../interface/interface";

type AppointmentWidgetProps = {
  appointment: MERAppointment;
};

export default function AppointmentWidget({
  appointment,
}: AppointmentWidgetProps) {
  return (
    <div
      className={`flex h-52 w-52 overflow-hidden rounded-3xl text-black relative`}
    >
      <div className="relative w-16 items-center justify-evenly overflow-hidden">
        <div
          className={`absolute bottom-0 left-full flex h-16 w-52 origin-bottom-left -rotate-90 items-center justify-center gap-3 ${
            appointment.status === "booked"
              ? "bg-gray-200"
              : appointment.status === "confirmed"
              ? "bg-blue-200"
              : appointment.status === "inprogress"
              ? "bg-purple-200"
              : appointment.status === "cancelled"
              ? "bg-red-200"
              : appointment.status === "hold"
              ? "bg-orange-100"
              : appointment.status === "overdue"
              ? "bg-red-300"
              : appointment.status === "completed"
              ? "bg-green-200"
              : "bg-default-200"
          }`}
        >
          <div className={`text-lg font-semibold tracking-widest uppercase`}>
            {appointment.status}
          </div>
        </div>
      </div>
      <div
        className={`relative h-full w-36 p-4 text-sm
          ${
            appointment.status === "booked"
              ? "bg-gray-100"
              : appointment.status === "confirmed"
              ? "bg-blue-100"
              : appointment.status === "inprogress"
              ? "bg-purple-100"
              : appointment.status === "cancelled"
              ? "bg-red-100"
              : appointment.status === "hold"
              ? "bg-orange-50"
              : appointment.status === "overdue"
              ? "bg-red-50"
              : appointment.status === "completed"
              ? "bg-green-100"
              : "bg-default-100"
          }
          `}
      >
        {/* The background should match the container's background */}
        <div className="absolute -left-2 -top-2 z-10 h-4 w-4 rounded-full bg-background" />
        <div className="flex justify-around pb-2">
          <div className="flex flex-col text-sm font-bold whitespace-nowrap text-ellipsis overflow-hidden max-w-[100px]">
            {appointment.name.split(" ")[0]}
          </div>
        </div>
        <div className="mt-2 tracking-tight">Appointment ID</div>
        <div className="flex items-center justify-between font-bold">
          <p className="uppercase italic">
            #{appointment._id.toString().slice(-6) || "001"}
          </p>
        </div>
        <div className="mt-2 tracking-tight">Date</div>
        <div className="flex font-bold italic">
          <p>{appointment.appointmentdate || "2023-07-09"}</p>
        </div>
        {/* The background should match the container's background */}
        <div className="absolute -bottom-2 -left-2 z-10 h-4 w-4 rounded-full bg-background" />
      </div>
    </div>
  );
}
