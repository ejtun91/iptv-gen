import React, { useEffect, useRef } from "react";

const AdBanner = () => {
  const banner = useRef();
  const atOptions = {
    key: "c987fe3643a7a0b52c36f05edb975e77",
    format: "iframe",
    height: 60,
    width: 468,
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

  return <div style={{ textAlign: "center" }} ref={banner}></div>;
};

export default AdBanner;
