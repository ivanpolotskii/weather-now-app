import React, { useEffect, useState } from "react";
import axios from "axios";
import { weatherTypes } from "../data";
import formStore from "../FormStore";
import { observer } from "mobx-react";
import "../index.scss";

const Container = observer((props) => {
  const [backgroundImage, setBackgroundImage] = useState(
    "url(путь_к_вашему_изображению)"
  );
  const [currentTime, setCurrentTime] = useState(new Date()); // Добавили состояние для текущего времени

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000); // Обновляем время каждую секунду
    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, []);

  const tryChangeBackground = (newImageUrl) => {
    // const img = new Image();
    setBackgroundImage(`url(${newImageUrl})`);
    document.body.style.backgroundImage = `url(${newImageUrl})`;
    // img.onload = () => {
    //   setBackgroundImage(`url(${newImageUrl})`);
    //   document.body.style.backgroundImage = `url(${newImageUrl})`;
    // };
    // img.onerror = () => {
    //   console.log("Изображение не найдено, устанавливаем запасной фон");
    //   document.body.style.backgroundColor = "black";
    // };
    // img.src = newImageUrl;
  };

  const fetchData = () => {
    axios
      .get(
        "https://api.open-meteo.com/v1/forecast?latitude=51.713151&longitude=39.1661&current=weather_code&hourly=temperature_2m,rain,snowfall,cloud_cover,visibility&forecast_days=1"
      )
      .then((res) => {
        const currentHourIndex = new Date().getHours();
        formStore.setTemp(res.data.hourly.temperature_2m[currentHourIndex]);

        let cloudPercent = res.data.hourly.cloud_cover[currentHourIndex];
        let rain = res.data.hourly.rain[currentHourIndex];
        let snowfall = res.data.hourly.snowfall[currentHourIndex];

        if (cloudPercent > 80) formStore.setWeather("clouds");
        else if (cloudPercent < 80 && cloudPercent > 40)
          formStore.setWeather("sunclouds");
        else if (cloudPercent < 40) formStore.setWeather("sun");
        if (rain > 0) formStore.setWeather("rain");
        if (snowfall > 0) formStore.setWeather("snowfall");
      });
  };

  useEffect(() => {
    tryChangeBackground(
      weatherTypes.find((weatherType) => weatherType.type === formStore.weather)
        ?.img
    );
    fetchData();
    return () => {
      // document.body.style.backgroundImage = "none";
    };
  });

  return (
    <div className="container">
      <div className="weather-icon">
        {
          weatherTypes.find(
            (weatherType) => weatherType.type === formStore.weather
          )?.icon[+(new Date().getHours() > 4)]
        }
      </div>
      <div className="temperature">{Math.round(formStore.temp)}°C</div>
      <p>
        {
          weatherTypes.find(
            (weatherType) => weatherType.type === formStore.weather
          )?.name
        }
      </p>
      <div className="city-time">
        <h2>Воронеж</h2>
        <p>Сейчас: {currentTime.toLocaleTimeString()}</p>{" "}
        {/* Отображаем текущее время */}
      </div>
    </div>
  );
});

export default Container;
