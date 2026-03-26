import Card from "../Card/Card";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const AddtionalInfoSkeleton = (props: Props) => {
  return (
    <Card
      animate={false}
      title="Current Weather"
      childrenClassName="flex flex-col items-center gap-7">
      <div className="flex flex-col items-center">
        <Skeleton className="w-30 h-15" />
        <Skeleton className="size-16 rounded-full mt-3" />
        <Skeleton className="w-22 h-7 mt-3" />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-500">Local Time:</p>
        <Skeleton className="w-24 h-8" />
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">Feels like</p>
          <Skeleton className="size-8" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">Humidity</p>
          <Skeleton className="size-8" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">Wind Speed</p>
          <Skeleton className="size-8" />
        </div>
      </div>
    </Card>
  );
};

export default AddtionalInfoSkeleton;
