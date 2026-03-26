import Card from "../Card/Card";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const AddtionalInfoSkeleton = (props: Props) => {
  return (
    <Card
      animate={false}
      title="Daily Forecast"
      childrenClassName="flex flex-col gap-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex justify-between">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="w-9 h-9" />
          <Skeleton className="w-9 h-9" />
          <Skeleton className="w-9 h-9" />
        </div>
      ))}
    </Card>
  );
};

export default AddtionalInfoSkeleton;
