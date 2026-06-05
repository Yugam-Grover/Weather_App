import clsx from "clsx";

type Props = {
  className?: string;
  src: string;
};

const WeatherIcon = ({ className, src }: Props) => {
  return (
    <img
      className={clsx("size-10", className)}
      src={`https://openweathermap.org/payload/api/media/file/${src}.png`}
      alt="Weather Icon"
    />
  );
};

export default WeatherIcon;
