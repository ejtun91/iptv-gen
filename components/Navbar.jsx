import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { Close, Menu } from "@material-ui/icons";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <Link href="/" passHref>
          <div className={styles.logoContainer} onClick={closeMenu}>
            <Image src="/img/logo.svg" alt="" width={160} height={60} />
          </div>
        </Link>
      </div>
      <div onClick={handleClick} className={styles.navIcon}>
        {open ? <Close /> : <Menu />}
      </div>
      <ul className={!open ? styles.list : styles.listActive}>
        <li className={styles.listItem} onClick={closeMenu}>
          <Link href="/" passHref>
            Home
          </Link>
        </li>
        <li className={styles.listItem} onClick={closeMenu}>
          <Link href="/newchannels" passHref>
            New Channels
          </Link>
        </li>
        <li className={styles.listItem} onClick={closeMenu}>
          <Link href="/sports" passHref>
            Sports
          </Link>
        </li>
        <li className={styles.listItem} onClick={closeMenu}>
          <Link href="/faq" passHref>
            FAQ
          </Link>
        </li>
        <li className={styles.listItem} onClick={closeMenu}>
          <Link href="/privacy" passHref>
            Privacy Policy
          </Link>
        </li>
        <li className={styles.listItem} onClick={closeMenu}>
          <Link href="/contact" passHref>
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
