import clsx from "clsx";
import React from "react";
import { he } from "zod/locales";

type Props = {
  className?: string;
};

const WeatherIcon = ({ className }: Props) => {
  return (
    <img
      className={clsx("size-10", className)}
      src="https://openweathermap.org/payload/api/media/file/10d@2x.png"
      alt="hourly weather"
    />
  );
};

export default WeatherIcon;
