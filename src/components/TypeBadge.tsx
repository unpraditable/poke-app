export default function TypeBadge({
  type,
  mainType,
}: {
  type: string;
  mainType: string;
}) {
  return (
    <span
      className={`${mainType} brightness-110 text-gray-700 text-xs sm:text-md font-bold p-1 sm:px-3 sm:py-1 rounded-lg capitalize`}
    >
      {type}
    </span>
  );
}
