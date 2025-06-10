import { useEffect, useState } from 'react';
import CountriesServices from './services/countries';

const Filter = ({ query, handleQuery }) => {
  return (
    <div>
      Find Countries <input value={query} onChange={handleQuery} />
    </div>
  );
};

const Detail = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    CountriesServices.getCoord(country.capital[0])
      .then((coord) => {
        const capital = coord[0];

        console.log(capital.lat);
        console.log(capital.lon);
        return CountriesServices.getWeather(capital.lat, capital.lon);
      })
      .then((weather) => {
        console.log(weather);
        setWeather(weather);
        console.log(weather.main);
      });
  }, [country]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>{country.capital[0]}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      {Object.values(country.languages).map((lang) => (
        <li key={lang}>{lang}</li>
      ))}
      <br />
      <img src={country.flags.png} alt={`${country.name.common} flags`} />
      <h2>Weather</h2>
      {weather ? (
        <div>
          <p>Temperature {Math.round(weather.main.temp - 273.15)} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt=""
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading weather ...</p>
      )}
    </div>
  );
};

const Individual = ({ name, country }) => {
  const [show, setShow] = useState(false);

  const handleDisplay = () => {
    console.log(name, show);
    setShow(!show);
  };

  if (show) {
    return (
      <div>
        {name} <button onClick={handleDisplay}>collape</button>
        <Detail country={country} />
      </div>
    );
  }

  return (
    <div>
      {name} <button onClick={handleDisplay}>show</button>
    </div>
  );
};

const Display = ({ countries }) => {
  if (countries.length === 0) {
    return null;
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length > 1 && countries.length <= 10) {
    return (
      <div>
        {countries.map((c) => (
          <div key={c.name.common}>
            <Individual name={c.name.common} country={c} />
          </div>
        ))}
      </div>
    );
  }

  if (countries.length === 1) {
    const country = countries[0];
    return <Detail country={country} />;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);

  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('effect');
    CountriesServices.getAll().then((returnData) => {
      setCountries(returnData);
      console.log(returnData);
      console.log(returnData[0].name.common);
    });
  }, []);

  const handleQuery = (e) => {
    console.log(e.target.value);
    setQuery(e.target.value);
  };

  const displayCountries =
    query === ''
      ? []
      : countries.filter((c) =>
          c.name.common.toLowerCase().includes(query.toLowerCase())
        );
  console.log(displayCountries);

  return (
    <div>
      <Filter query={query} handleQuery={handleQuery} />
      <Display countries={displayCountries} />
    </div>
  );
};

export default App;
