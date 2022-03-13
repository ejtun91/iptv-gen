import { useState } from "react";
import styles from "../styles/Contact.module.css";
import Head from "next/head";

const Contact = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>IPTV Generator | Contact</title>
        <meta
          name="description"
          content="feel free to contact us on the contact page. If you have any queries regarding to our services please feel free to do so."
        />
        {/*<!-- Google / Search Engine Tags -->*/}
        <meta itemProp="name" content={`IPTV Generator | Contact`} />
        <meta
          itemProp="description"
          content="iptv generator is website with thousands of channels for streaming, where you can customize your own iptv list and download it."
        />
      </Head>
      <div className={styles.mainContainer}>
        <div className={styles.newChannelsTitle}>
          <h1>Contact</h1>
        </div>
        <div className={styles.form}>
          <label htmlFor="">Full Name: </label>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="enter your full name"
          />
          <label htmlFor="">Email: </label>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="enter your email"
          />
          <textarea
            className={styles.textarea}
            name="content"
            id="content"
            cols="30"
            rows="10"
          ></textarea>
          <button className={styles.button}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
