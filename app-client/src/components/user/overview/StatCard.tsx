function StatCard({
  name,
  average,
  total,
  className,
}: {
  name: string;
  average: number;
  total: number;
  className?: string;
}) {
  return (
    <section
      className={
        "flex flex-col justify-center items-center bg-slate-800 rounded-xl p-4 " +
        className
      }
    >
      <h2 className="text-2xl font-medium">{name}</h2>
      <span className="text-4xl mt-1.5">{average}</span>
      <span className="text-xl mt-1">Total {total}</span>
    </section>
  );
}

export default StatCard;
