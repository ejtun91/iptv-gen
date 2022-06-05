import React, { useEffect, useRef } from "react";

const AdBanner = () => {
  const banner = useRef();
  const atOptions = {
    key: "0e5fab4278c3a05c7de0af03bb2df3dd",
    format: "iframe",
    height: 250,
    width: 300,
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

  return <div ref={banner}></div>;
};

export default AdBanner;
