// FormStore.js
import { observable, action, makeObservable } from 'mobx';

class FormStore {
  temp = "";
  weather = "";
  constructor() {
    makeObservable(this, {
      
      temp:observable,
      weather:observable,
      
      setTemp:action,
      setWeather:action,
    });
  }

  
  setTemp(value){
    this.temp = value;
  }
  setWeather(value){
    this.weather = value;
  }
  
}

const formStore = new FormStore();
export default formStore;
