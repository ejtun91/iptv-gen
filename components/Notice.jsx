import styles from "../styles/Sidebar.module.css";

const Notice = () => {
  return (
    <>
      <h2 className={styles.title}>Notice</h2>
      <p className={styles.noticeDesc}>
        IPTV Generator website do not host or stream any of the content found on
        the website, we are only finding the links which are already distributed
        all around the Internet and RESHARE them here. We urge all copyright
        owners, to recognise that links contained within this site are located
        somewhere else on the web. Please direct all copyright infringement
        issues to the companies that host these files.
      </p>
    </>
  );
};

export default Notice;
