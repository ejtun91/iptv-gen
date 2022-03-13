import { Search } from "@material-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/CountryList.module.css";

const SearchBar = ({ query, setQuery }) => {
  const router = useRouter();

  const searchHandle = (e) => {
    router.push(`/searchresults/${query}`);
    setQuery("");
  };
  console.log(query);

  return (
    <>
      <input
        className={styles.inputSearch}
        type="text"
        value={query}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            searchHandle();
          }
        }}
        placeholder="Search for a channel"
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <span className={styles.icon} onClick={(e) => searchHandle(e)}>
          <Search />
        </span>
      )}
    </>
  );
};

export default SearchBar;
