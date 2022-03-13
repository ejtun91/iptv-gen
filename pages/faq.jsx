import { ArrowDropDown } from "@material-ui/icons";
import React, { useState } from "react";
import styles from "../styles/Faq.module.css";
import { faq } from "../data";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleChange = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.newChannelsTitle}>
          <h1>FAQ</h1>
        </div>
        <div className={styles.items}>
          {faq.map((item, index) => {
            return (
              <div key={index} className={styles.item}>
                <div
                  onClick={() => handleChange(index)}
                  className={styles.clickable}
                >
                  <h2>{item.title}</h2>
                  <ArrowDropDown />
                </div>
                <p
                  className={
                    activeIndex !== index ? styles.content : styles.contentShow
                  }
                >
                  {item.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Faq;
