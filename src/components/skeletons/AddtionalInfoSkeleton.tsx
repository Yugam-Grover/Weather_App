import Card from "../Card/Card";
import { Skeleton } from "../ui/skeleton";

const AddtionalInfoSkeleton = () => {
  return (
    <Card
      animate={false}
      title="Additional Weather Info"
      childrenClassName="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex justify-between">
          <div className="flex gap-6">
            <Skeleton className="w-18 h-6" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <span>
            <Skeleton className="w-12 h-6" />
          </span>
        </div>
      ))}
    </Card>
  );
};

export default AddtionalInfoSkeleton;
