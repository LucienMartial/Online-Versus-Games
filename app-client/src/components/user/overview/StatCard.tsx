function StatCard({
  name,
  average,
  total,
}: {
  name: string;
  average: number;
  total: number;
}) {
  return (
    <section className="flex flex-col justify-center items-center bg-slate-800 rounded-xl p-4">
      <h2 className="text-2xl font-medium">{name}</h2>
      <span className="text-4xl mt-1.5">{average}</span>
      <span className="text-xl mt-1">Total {total}</span>
    </section>
  );
}

export default StatCard;