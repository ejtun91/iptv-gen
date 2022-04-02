import Image from "next/image";
import Link from "next/link";
import { countries } from "../data";
import styles from "../styles/CountryList.module.css";
import SearchBar from "./SearchBar";

const CountryList = ({ query, setQuery }) => {
  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchBar query={query} setQuery={setQuery} />
      </div>
      <div className={styles.itemFirst}>
        <h1 style={{ fontSize: "20px" }} className={styles.continentTitle}>
          EUROPE
        </h1>
      </div>
      {countries.slice(0, 40).map((country) => (
        <Link key={country.id} href={`/country/${country.id}`} passHref>
          <div className={styles.item}>
            <div className={styles.imgCountry}>
              <Image
                src={country.img}
                objectFit="contain"
                width={25}
                height={20}
                alt=""
                className={styles.imgCountry}
              />
            </div>
            <h2
              style={{ fontSize: "15px", margin: "inherit" }}
              className={styles.countryTitle}
            >
              {country.name}
            </h2>
          </div>
        </Link>
      ))}
      <div className={styles.itemFirst}>
        <h1 style={{ fontSize: "20px" }} className={styles.continentTitle}>
          NORTH AMERICA
        </h1>
      </div>
      {countries.slice(40, 42).map((country) => (
        <Link key={country.id} href={`/country/${country.id}`} passHref>
          <div key={country.id} className={styles.item}>
            <div className={styles.imgCountry}>
              <Image
                src={country.img}
                objectFit="contain"
                width={25}
                height={20}
                alt=""
                className={styles.imgCountry}
              />
            </div>
            <h2
              style={{ fontSize: "15px", margin: "inherit" }}
              className={styles.countryTitle}
            >
              {country.name}
            </h2>
          </div>
        </Link>
      ))}
      <div className={styles.itemFirst}>
        <h1 style={{ fontSize: "20px" }} className={styles.continentTitle}>
          LATIN AMERICA
        </h1>
      </div>
      {countries.slice(42, 57).map((country) => (
        <Link key={country.id} href={`/country/${country.id}`} passHref>
          <div key={country.id} className={styles.item}>
            <div className={styles.imgCountry}>
              <Image
                src={country.img}
                objectFit="contain"
                width={25}
                height={20}
                alt=""
                className={styles.imgCountry}
              />
            </div>
            <h2
              style={{ fontSize: "15px", margin: "inherit" }}
              className={styles.countryTitle}
            >
              {country.name}
            </h2>
          </div>
        </Link>
      ))}
      <div className={styles.itemFirst}>
        <h1 style={{ fontSize: "20px" }} className={styles.continentTitle}>
          AFRICA
        </h1>
      </div>
      {countries.slice(57, 66).map((country) => (
        <Link key={country.id} href={`/country/${country.id}`} passHref>
          <div key={country.id} className={styles.item}>
            <div className={styles.imgCountry}>
              <Image
                src={country.img}
                objectFit="contain"
                width={25}
                height={20}
                alt=""
                className={styles.imgCountry}
              />
            </div>
            <h2
              style={{ fontSize: "15px", margin: "inherit" }}
              className={styles.countryTitle}
            >
              {country.name}
            </h2>
          </div>
        </Link>
      ))}
      <div className={styles.itemFirst}>
        <h1 style={{ fontSize: "20px" }} className={styles.continentTitle}>
          ASIA
        </h1>
      </div>
      {countries.slice(66, 82).map((country) => (
        <Link key={country.id} href={`/country/${country.id}`} passHref>
          <div key={country.id} className={styles.item}>
            <div className={styles.imgCountry}>
              <Image
                src={country.img}
                objectFit="contain"
                width={25}
                height={20}
                alt=""
                className={styles.imgCountry}
              />
            </div>
            <h2
              style={{ fontSize: "15px", margin: "inherit" }}
              className={styles.countryTitle}
            >
              {country.name}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CountryList;
