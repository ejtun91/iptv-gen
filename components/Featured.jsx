import styles from "../styles/Featured.module.css";
import { useRef, useEffect } from "react";

const Featured = () => {
  const banner = useRef();

  const atOptions = {
    key: "53b4d73fe814a23d53844079c17969dd",
    format: "iframe",
    height: 90,
    width: 728,
    params: {},
  };

  useEffect(() => {
    if (!banner.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.topdisplayformat.com/${atOptions.key}/invoke.js`;
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      if (banner.current) {
        banner.current.append(conf);
        banner.current.append(script);
      }
    }
  }, []);

  return <div ref={banner} className={styles.container}></div>;
};

export default Featured;
