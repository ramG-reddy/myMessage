import { Skeleton } from "@chakra-ui/react";
import * as React from "react";

interface ISkeletonLoaderProps {
  count: number;
  height: string;
  width?: string;
}

const SkeletonLoader: React.FunctionComponent<ISkeletonLoaderProps> = ({
  count,
  height,
  width,
}) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Skeleton
          key={index}
          height={height}
          width={{ base: "full", md: width }}
          startColor="blackAlpha.400"
          endColor="whiteAlpha.300"
          borderRadius={4}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
