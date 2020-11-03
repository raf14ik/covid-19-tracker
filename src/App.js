import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import LineGraphD from "./LineGraphD";
import LineGraphR from "./LineGraphR";

import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import Footer from "./Footer";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__headerPar">
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                <h4>How to Protect yourself :</h4>
              </Typography>

              <ul>
                <li>
                  Clean your home regularly, particularly frequently touched
                  surfaces like.
                </li>
                <li>
                  Stay home stay safe. Stay physically fit. Exercise regulary.
                  Eat a nutritious diet. Don’t smoke.
                </li>
                <li>
                  Stay home stay safe. Follow the Golden Rule. Wash your hands
                  frequently with soap and water or use alchohol based hand-rub.
                </li>
                <li>
                  Stay home stay safe. If you show symptoms of COVID-19, self
                  isolate yourself, wear a mask around others and seek medical
                  advice.
                </li>
                <li>
                  Stay positive. Avoid alarmist news. Be connected to friends
                  and family. Have a hobby.
                </li>
                <li>
                  If any member of the household shows symptoms of Covid-19,
                  seek medical advice and follow your local health authority's
                  guidance.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
        <Footer />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3> New cases per day </h3>
            <LineGraph />
            <h3> Deaths per day </h3>
            <LineGraphD />
            <h3> Recovered per day </h3>
            <LineGraphR />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
