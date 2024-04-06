import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { observer } from "mobx-react";
import { weatherTypes } from "../data";
import formStore from "../FormStore";
import "../index.scss";


const Container = observer(() => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backgroundImage, setBackgroundImage] = useState(
    "url(путь_к_вашему_изображению)"
  );

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["weatherData"],
    queryFn: () => {
      return axios
        .get(
          "https://api.open-meteo.com/v1/forecast?latitude=51.713151&longitude=39.1661&current=weather_code&hourly=temperature_2m,rain,snowfall,cloud_cover,visibility&forecast_days=1"
        )
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      const currentHourIndex = new Date().getHours();
      const { temperature_2m, cloud_cover, rain, snowfall } = data.hourly;
      formStore.setTemp(temperature_2m[currentHourIndex]);
      determineWeather(cloud_cover[currentHourIndex], rain[currentHourIndex], snowfall[currentHourIndex]);
    }
  });

  const determineWeather = (cloudPercent, rain, snowfall) => {
    if (cloudPercent > 80) formStore.setWeather("clouds");
    else if (cloudPercent > 40) formStore.setWeather("sunclouds");
    else formStore.setWeather("sun");
    if (snowfall > 0) formStore.setWeather("snowfall");
    else if (rain > 0) formStore.setWeather("rain");
  };
  const tryChangeBackground = (newImageUrl) => {
    setBackgroundImage(`url(${newImageUrl})`);
    document.body.style.backgroundImage = `url(${newImageUrl})`;
  };
  useEffect(() => {
    if (data) {
      
      const currentHourIndex = new Date().getHours();
      const { temperature_2m, cloud_cover, rain, snowfall } = data.hourly;
      formStore.setTemp(temperature_2m[currentHourIndex]);
      determineWeather(cloud_cover[currentHourIndex], rain[currentHourIndex], snowfall[currentHourIndex]);
      tryChangeBackground(
        weatherTypes.find((weatherType) => weatherType.type === formStore.weather)
          ?.img
      );
    }
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
    
  }, [data]);

  if (isLoading) return <div>Loading weather data...</div>;
  if (isError) return <div>Error fetching weather data: {error.message}</div>;

  return (
    <div className="container">
      <div className="weather-icon">
        {
          weatherTypes.find(weatherType => weatherType.type === formStore.weather)?.icon[+(new Date().getHours() > 4)]
        }
      </div>
      <div className="temperature">{Math.round(formStore.temp)}°C</div>
      <p>{weatherTypes.find(weatherType => weatherType.type === formStore.weather)?.name}</p>
      <div className="city-time">
        <h2>Воронеж</h2>
        <p>Сейчас: {currentTime.toLocaleTimeString()}</p>
      </div>
    </div>
  );
});

export default Container;
