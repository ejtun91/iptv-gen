import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { countries } from "../data";
import styles from "../styles/Sidebar.module.css";
import MyList from "./MyList";
import Notice from "./Notice";
import Tags from "./Tags";

const Sidebar = ({ channels, tags }) => {
  const quantity = useSelector((state) => state.list?.quantity);
  const banner = useRef();
  const atOptions = {
    key: "a9b654a472dfc116371face553246fa3",
    format: "iframe",
    height: 600,
    width: 160,
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

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h2 className={styles.title}>New Channels</h2>
        <table className={styles.table}>
          <tbody className={styles.tBody}>
            {channels
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map((channel) => (
                <tr key={channel._id} className={styles.tr}>
                  <td className={styles.td}>
                    <Image
                      src={countries[channel.country - 1].img}
                      width={20}
                      height={15}
                    />
                    <h3
                      style={{ fontSize: "inherit", margin: "inherit" }}
                      className={styles.countryTitle}
                    >
                      {channel.title}
                    </h3>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Link href={`/newchannels`} passHref>
          <span className={styles.more}>More Channels...</span>
        </Link>
      </div>
      <div className={styles.item}>{quantity !== 0 && <MyList />}</div>
      <div className={styles.item}>
        <Notice />
      </div>
      <div className={styles.item}>
        <Tags tags={tags} />
      </div>
      <div ref={banner}></div>
    </div>
  );
};

export default Sidebar;
