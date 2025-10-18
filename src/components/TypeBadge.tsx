export default function TypeBadge({
  type,
  mainType,
}: {
  type: string;
  mainType: string;
}) {
  return (
    <span
      className={`${mainType} brightness-110 text-gray-700 text-md font-bold px-3 py-1 rounded-lg capitalize`}
    >
      {type}
    </span>
  );
}
