import type React from "react";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export const Skeleton = ({ className = "", ...props }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse rounded-sm bg-slate-200/80 ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

export const TableSkeletonRows = ({
  rows = 5,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <td className="px-8 py-4" key={columnIndex}>
              <Skeleton
                className={
                  columnIndex === columns - 1
                    ? "ml-auto h-4 w-5"
                    : "h-4 w-full min-w-20"
                }
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
