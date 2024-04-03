import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from "axios";
import { city } from './cities';

const API_KEY = {
  key: "b964807821db46717bd52a925424ac3c",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [cities, setCities] = useState([]);
  const refInput = useRef();

  useEffect(() => {
    startAppIp();
  }, []);

  const startAppIp = async () => {
    const cityIp = (await axios.get("https://ipapi.co/json/")).data.region;

    search({ key: "Enter" }, cityIp === "St.-Petersburg" ? "Санкт-Петербург" : cityIp);
  }

  const search = async (evt, city = undefined) => {
    if (evt.key === "Enter") {

      try {
        setCities([]);

        const result = await axios.get(`${API_KEY.base}weather?q=${city ? city : query}&units=metric&APPID=${API_KEY.key}`);
        setWeather(result.data);
        setQuery("");
      } catch (error) {
        console.log("Произошла ошибка: ", error);
      }
    }
  }

  const dateBuilder = (date) => {
    const months = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'октябрь',
      'Ноябрь',
      'Декабрь',
    ];

    const days = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ];

    const day = days[date.getDay()];
    const dateInNumbers = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${dateInNumbers}, ${month} ${year}`;
  }

  const changeInput = () => {

    const textSearch = refInput.current.value;

    setQuery(textSearch);

    if (textSearch === "") {
      setCities([]);
      return;
    }
    const citys = city.city.filter(city => city.name.split('').slice(0, textSearch.split('').length).join('').toLocaleLowerCase() === textSearch.toLocaleLowerCase());

    setCities(citys);
  }


  return (
    <div
      className="App"
      style={{
        backgroundImage: (typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? "url('/warm-bg.jpg')" : weather.main.temp <= -10 ? (weather.main.temp <= -20 ? "url('/cold-cold-cold-bg.gif')" : "url('/cold-cold-bg.gif')") : "url('/cold-bg.jpg')") : "url('/cold-bg.jpg')",
        transition: "0.4s ease"
      }}

    >
      <main>
        <div className="search-box">
          <input
            type="text"
            className='search-bar'
            placeholder='Найти...'
            value={query}
            onChange={changeInput}
            ref={refInput}
            onKeyPress={search}
          />
          <div>
            {
              cities.slice(0, 5).map((city, id) => {
                return (
                  <div key={id} className='search-city' onClick={() => {
                    search({ key: "Enter" }, city.name);
                  }
                  }>
                    {city.name}
                  </div>
                );
              })
            }
          </div>
        </div>
        {
          typeof weather.main !== "undefined" ? (
            <div>
              <div className="location-box">
                <div className="location">
                  {weather.name}, {weather.sys.country}
                </div>
                <div className="date">{dateBuilder(new Date())}</div>
                <div className="weather-box">
                  <div className="temp">
                    {Math.floor(weather.main.temp)}°C
                  </div>
                  <div className="weather">
                    {weather.weather[0].main}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )
        }
      </main>
    </div>
  );
}

export default App;
