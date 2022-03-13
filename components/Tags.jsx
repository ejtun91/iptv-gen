import Link from "next/link";
import styles from "../styles/Sidebar.module.css";

const Tags = ({ tags }) => {
  return (
    <>
      <h2 className={styles.title}>Tags</h2>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <Link key={tag._id} href={"/"} passHref>
            <span className={styles.tag}>{tag.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Tags;
