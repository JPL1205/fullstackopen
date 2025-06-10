import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';

const API_KEY = 'a4f714e132a3e079fa3fe154a19b4489';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getWeather = (lat, lon) => {
  const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  //   const request = axios.get(
  //     `https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=${API_KEY}`
  //   );
  return request.then((response) => response.data);
};

const getCoord = (city) => {
  const request = axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  );
  return request.then((response) => response.data);
};

export default { getAll, getWeather, getCoord };
