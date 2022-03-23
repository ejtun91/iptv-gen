import Image from "next/image";
import styles from "../styles/Footer.module.css";
import Link from "next/link";

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
          <li className={styles.listItem}>
            <Link href="/" passHref>
              Home
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/newchannels" passHref>
              New Channels
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/sports" passHref>
              Sport
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/contact" passHref>
              Contact Us
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/privacy" passHref>
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
