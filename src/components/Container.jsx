import React, { useEffect } from 'react';
import axios from 'axios';
import { weatherTypes } from '../data';
import formStore from '../FormStore';
import { observer } from 'mobx-react';

const Container = observer((props) => {
  const fetchData = () => {
    axios.get("https://api.open-meteo.com/v1/forecast?latitude=51.713151&longitude=39.1661&current=weather_code&hourly=temperature_2m,rain,snowfall,cloud_cover,visibility&forecast_days=1").then(res => {
      const currentHourIndex = (new Date()).getHours();
      formStore.setTemp(res.data.hourly.temperature_2m[currentHourIndex]);
      
      let cloudPercent = res.data.hourly.cloud_cover[currentHourIndex];
      let rain = res.data.hourly.rain[currentHourIndex];
      let snowfall = res.data.hourly.snowfall[currentHourIndex];
      
      if(cloudPercent>80){
        formStore.setWeather("clouds");
      }else if(cloudPercent<80 && cloudPercent>40){
        formStore.setWeather("sunclouds");
      }else if(cloudPercent<40){
        formStore.setWeather("sun");
      }
      if(rain>0) formStore.setWeather("rain");
      if(snowfall>0) formStore.setWeather("snowfall");

      console.log(weatherTypes.find(weatherType => weatherType.type === formStore.weather)?.img);
    });
  }

  useEffect(() => {
    document.body.style.backgroundImage = `url('${weatherTypes.find(weatherType => weatherType.type === formStore.weather)?.img}')`;
    fetchData();
  });

  return (
    <div className="container">
        <div className="weather-icon">{weatherTypes.find(weatherType => weatherType.type === formStore.weather)?.icon}</div>
        <div className="temperature">{Math.round(formStore.temp)}°C</div>
        <p>{weatherTypes.find(weatherType => weatherType.type === formStore.weather)?.name}</p>
    </div>
  );
});

export default Container;
