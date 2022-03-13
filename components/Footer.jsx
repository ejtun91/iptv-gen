import Image from "next/image";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h2 className={styles.aboutTitle}>ABOUT IPTV GEN</h2>
      </div>
      <div className={styles.item}>
        <div className={styles.imageContainer}>
          <Image src="/img/logo.svg" height={150} width={450} alt="" />
        </div>
        <p className={styles.aboutDesc}>
          IPTV Generator is the website where you can find all your favourite
          channels and download them. Make your custom list of channels and
          reproduce literally anywhere, from your mobile or TV. There is no need
          to know any of the IPTV stuff, we will take care of that, while you
          enjoy at the comfort of your home. If you cannot find your channel,
          there is high probability it is still not uploaded yet, but it will be
          eventually.
        </p>
      </div>
      <div className={styles.item}>
        <span className={styles.copyright}>IPTV Gen @2022</span>
        <ul className={styles.list}>
          <li className={styles.listItem}>Home</li>
          <li className={styles.listItem}>New Channels</li>
          <li className={styles.listItem}>Sport</li>
          <li className={styles.listItem}>Contact Us</li>
          <li className={styles.listItem}>Privacy Policy</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
