import styles from "../styles/Admin.module.css";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from "react";
import { ArrowBack } from "@material-ui/icons";
import { useRef } from "react";
import { countries } from "../data";
import Link from "next/link";

const DropDownMenu = () => {
  const [activeMenu, setMenuActive] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  const DropDownItem = (props) => {
    return (
      <a
        href="#"
        className={styles.dropMenuItem}
        onClick={() => props.goToMenu && setMenuActive(props.goToMenu)}
      >
        <span className={styles.dropIconMenu}>{props.leftIcon}</span>
        {props.children}
        <span className={styles.iconRight}>{props.rightIcon}</span>
      </a>
    );
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === "main"}
        unmountOnExit
        timeout={500}
        classNames="menu-primary"
      >
        <div className="menu">
          {/* <DropDownItem>WORLD</DropDownItem> */}
          <DropDownItem goToMenu="europe">EUROPE</DropDownItem>
          <DropDownItem goToMenu="north-america">NORTH AMERICA</DropDownItem>
          <DropDownItem goToMenu="latin">LATIN AMERICA</DropDownItem>
          <DropDownItem goToMenu="africa">AFRICA</DropDownItem>
          <DropDownItem goToMenu="asia">ASIA</DropDownItem>
          <DropDownItem goToMenu="sports">
            <Link href={`admin/countries/83`} passHref>
              Sports
            </Link>
          </DropDownItem>
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === "europe"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
      >
        <div className="menu">
          <DropDownItem
            goToMenu="main"
            leftIcon={
              <ArrowBack
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            }
          >
            <h4>Go Back</h4>
          </DropDownItem>
          {countries.slice(0, 40).map((country) => (
            <DropDownItem key={country.id} country={country}>
              <Link
                key={country.id}
                href={`/admin/countries/${country.id}`}
                passHref
              >
                {country.name}
              </Link>
            </DropDownItem>
          ))}
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === "north-america"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
      >
        <div className="menu">
          <DropDownItem
            goToMenu="main"
            leftIcon={
              <ArrowBack
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            }
          >
            <h4>Go Back</h4>
          </DropDownItem>

          {countries.slice(40, 42).map((country) => (
            <DropDownItem key={country.id}>
              {" "}
              <Link
                key={country.id}
                href={`/admin/countries/${country.id}`}
                passHref
              >
                {country.name}
              </Link>
            </DropDownItem>
          ))}
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === "latin"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
      >
        <div className="menu">
          <DropDownItem
            goToMenu="main"
            leftIcon={
              <ArrowBack
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            }
          >
            <h4>Go Back</h4>
          </DropDownItem>

          {countries.slice(42, 57).map((country) => (
            <DropDownItem key={country.id}>
              {" "}
              <Link
                key={country.id}
                href={`/admin/countries/${country.id}`}
                passHref
              >
                {country.name}
              </Link>
            </DropDownItem>
          ))}
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === "africa"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
      >
        <div className="menu">
          <DropDownItem
            goToMenu="main"
            leftIcon={
              <ArrowBack
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            }
          >
            <h4>Go Back</h4>
          </DropDownItem>

          {countries.slice(57, 66).map((country) => (
            <DropDownItem key={country.id}>
              {" "}
              <Link
                key={country.id}
                href={`/admin/countries/${country.id}`}
                passHref
              >
                {country.name}
              </Link>
            </DropDownItem>
          ))}
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === "asia"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
      >
        <div className="menu">
          <DropDownItem
            goToMenu="main"
            leftIcon={
              <ArrowBack
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            }
          >
            <h4>Go Back</h4>
          </DropDownItem>

          {countries.slice(66, 82).map((country) => (
            <DropDownItem key={country.id}>
              {" "}
              <Link
                key={country.id}
                href={`/admin/countries/${country.id}`}
                passHref
              >
                {country.name}
              </Link>
            </DropDownItem>
          ))}
        </div>
      </CSSTransition>
    </div>
  );
};

export default DropDownMenu;
