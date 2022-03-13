import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { countries } from "../data";
import styles from "../styles/Sidebar.module.css";
import MyList from "./MyList";
import Notice from "./Notice";
import Tags from "./Tags";

const Sidebar = ({ channels, tags }) => {
  const quantity = useSelector((state) => state.list?.quantity);

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
                    <span className={styles.countryTitle}>{channel.title}</span>
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
    </div>
  );
};

export default Sidebar;
