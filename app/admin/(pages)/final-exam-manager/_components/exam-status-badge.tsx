interface Props {
  status: "LIVE" | "DRAFT";
}

const ExamStatusBadge = ({ status }: Props) => {
  const isLive = status === "LIVE";

  return (
    <div
      className={`inline-flex rounded-full px-4 py-1 text-xs font-semibold ${
        isLive ? "bg-[#DDF5DF] text-[#0B8A4D]" : "bg-[#E8ECE7] text-[#5F665F]"
      }`}
    >
      {status}
    </div>
  );
};

export default ExamStatusBadge;
