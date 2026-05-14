interface Props {
  status: string;
}

const TransactionStatusBadge = ({ status }: Props) => {
  return (
    <div className="inline-flex rounded-full bg-[#EAF6EF] px-3 py-1 text-xs font-semibold text-[#0B8A4D]">
      {status}
    </div>
  );
};

export default TransactionStatusBadge;
