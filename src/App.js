import "./App.css";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import InitialMap from "./InitialMap";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { Helmet } from "react-helmet";

function App() {
  const [countries, setCountries] = useState([]);
  const [initial, setInitial] = useState(1);
  const [country, setInputCountry] = useState("worldwide");
  const [countryName, setCountryName] = useState("Worldwide");
  const [urlCondition, setUrlCondition] = useState("all");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState();
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [casesName, setCasesName] = useState("Cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United State, India, United Kingdom
            value: country.countryInfo.iso2, // USA, FR, UK
            flag: country.countryInfo.flag,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, [countries]);

  const onCountryChange = async (e) => {
    setInitial(0);
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
        if (countryCode === "worldwide") {
          setMapCenter([23.8859, 45.0792]);
          setMapZoom(2);
          setCountryName("Worldwide");
          setUrlCondition("all");
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
          setCountryName(data.country);
          setUrlCondition(countryCode);
        }
      });
  };

  const initialMap = () => {
    if (initial === 1) {
      return (
        <InitialMap
          casesType={casesType}
          countries={mapCountries}
          center={[23.8859, 45.0792]}
          zoom={2}
        />
      );
    } else if (initial === 0) {
      return (
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      );
    }
  };

  return (
    <div className="app">
      <Helmet>
        <title>Covid-19 Live Tracker</title>
        <meta name="description" content="Covid-19 Live Tracker" />
        <meta
          name="title"
          property="og:title"
          content="Covid-19 Live Tracker"
        />
        <meta property="og:type" content="Website" />
        <meta
          name="image"
          property="og:image"
          content="https://live.staticflickr.com/65535/51209142753_d692e1412d_k.jpg"
        />
        <meta
          name="description"
          property="og:description"
          content="Covid-19 Live Tracker App"
        />
        <meta name="author" content="Dishant Behera" />
      </Helmet>
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 LIVE TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => {
              setCasesType("cases");
              setCasesName("Cases");
            }}
            title="Confirmed"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            isGreen
            active={casesType === "recovered"}
            onClick={(e) => {
              setCasesType("recovered");
              setCasesName("Recovered");
            }}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isOrange
            active={casesType === "deaths"}
            onClick={(e) => {
              setCasesType("deaths");
              setCasesName("Deaths");
            }}
            title="Deceased"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        {initialMap()}
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app_graphTitle">
            {countryName} New {casesName}
          </h3>
          <LineGraph
            urlCondition={urlCondition}
            className="app_graph"
            casesType={casesType}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
