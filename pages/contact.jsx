import { useRef, useState } from "react";
import styles from "../styles/Contact.module.css";
import Head from "next/head";
import emailjs from "emailjs-com";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  const [message, setMessage] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const formRef = useRef();

  function onChange(value) {
    setCaptcha(value);
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    var response = grecaptcha.getResponse();
    console.log(response);

    emailjs
      .sendForm(
        "service_sage0jc",
        "template_e59faif",
        formRef.current,
        "user_fN2wp23ZDkG5XeV0KKr5u"
      )
      .then(
        (result) => {
          console.log(result.text);
          setMessage(true);
          formRef.current.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

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
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        ></script>
      </Head>
      <div className={styles.mainContainer}>
        <div className={styles.newChannelsTitle}>
          <h1>Contact</h1>
        </div>
        <form
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className={styles.form}>
            <label htmlFor="">Full Name: </label>
            <input
              className={styles.input}
              type="text"
              name="user_name"
              required
              id="user_name"
              placeholder="enter your full name"
            />
            <label htmlFor="">Email: </label>
            <input
              className={styles.input}
              type="email"
              id="user_email"
              name="user_email"
              required
              placeholder="enter your email"
            />
            <label htmlFor="user_subject">Subject: </label>
            <input
              type="text"
              id="user_subject"
              className={styles.input}
              required
              placeholder="Subject"
              name="user_subject"
            />
            <textarea
              className={styles.textarea}
              name="message"
              id="content"
              required
              cols="30"
              rows="10"
            ></textarea>
            <ReCAPTCHA
              sitekey="6LclSgYfAAAAAO23CmYVQKniQ9t1uMuHGRmDKvLm"
              onChange={onChange}
            />
            <br />
            <button type="submit" disabled={!captcha} className={styles.button}>
              Send
            </button>
            {message && (
              <span style={{ marginTop: "1em", height: "20px" }}>
                Thank you for your message
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
