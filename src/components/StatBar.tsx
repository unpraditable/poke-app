export default function StatBar({
  statName,
  value,
  max = 255,
}: {
  statName: string;
  value: number;
  max?: number;
}) {
  const percentage = (value / max) * 100;
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-gray-600 font-medium w-20 text-sm lg:text-md">
        {statName}
      </span>
      <span className="text-gray-800 font-bold w-8 text-sm lg:text-md">
        {value}
      </span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            value > 59 ? "bg-green-500" : "bg-red-500"
          } transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
