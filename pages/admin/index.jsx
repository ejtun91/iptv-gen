import { ArrowDropDown } from "@material-ui/icons";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import DropDownMenu from "../../components/DropDownMenu";
import { axiosInstance } from "../../config";
import { countries } from "../../data";
import styles from "../../styles/Admin.module.css";

const Admin = ({ channels }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [countryId, setCountryId] = useState("");
  const [url, setUrl] = useState("");
  const [onFinish, setOnFinish] = useState(false);
  const [error, setOnError] = useState(false);
  const [playlist, setPlaylist] = useState("");
  const [tag, setTag] = useState("");
  const [disabled, setDisabled] = useState({
    firstBtn: false,
    secondBtn: false,
  });

  const country = parseInt(countryId);
  console.log(channels);

  const handleUpload = async () => {
    try {
      await axiosInstance.put("/upload/upload", {
        playlist: playlist,
      });
      setDisabled((prevState) => ({
        ...prevState,
        firstBtn: true,
      }));
      console.log(disabled);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(disabled.firstBtn);

  const handleReplaceLinks = async () => {
    try {
      await axiosInstance.post("/upload/upload", {
        playlist: playlist,
        channels: channels,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveExtraText = async () => {
    try {
      await axiosInstance.get("/upload/upload");
      setDisabled((prevState) => ({
        ...prevState,
        secondBtn: true,
      }));
      console.log(disabled);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {
    try {
      const newChannel = {
        title,
        country,
        url,
      };

      await axiosInstance.post("/countries/admin", newChannel);
      setOnFinish(true);
    } catch (error) {
      console.log(error);
      setOnFinish(false);
      setOnError(true);
    }
  };

  const handleTag = async () => {
    try {
      await axiosInstance.post("/tags", {
        name: tag,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <a
              href="#"
              className={styles.iconMenu}
              onClick={() => setOpen(!open)}
              style={{ borderRadius: "5px !important" }}
            >
              <span style={{ color: "#e0e0e0" }}>WORLD</span> <ArrowDropDown />
            </a>
            {open && <DropDownMenu />}
          </li>
        </ul>
      </div>
      <div className={styles.item}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2em",
            width: "800px",
          }}
        >
          <h3>Upload whole playlist</h3>
          <textarea
            name="textarea"
            id="textarea"
            cols="30"
            onChange={(e) => setPlaylist(e.target.value)}
            className={styles.textarea}
            rows="10"
          ></textarea>
          <button onClick={handleUpload} className={styles.uploadBtn}>
            Upload
          </button>
          <button
            style={
              !disabled.firstBtn
                ? { backgroundColor: "gray", cursor: "not-allowed" }
                : { backgroundColor: "#004e89" }
            }
            disabled={!disabled.firstBtn}
            onClick={handleRemoveExtraText}
            className={styles.replaceBtn}
          >
            Remove HD|UHD
          </button>
          <button
            style={
              !disabled.secondBtn
                ? { backgroundColor: "gray", cursor: "not-allowed" }
                : { backgroundColor: "#004e89" }
            }
            onClick={handleReplaceLinks}
            className={styles.replaceBtn}
            disabled={!disabled.secondBtn}
          >
            Replace Links
          </button>
        </div>
      </div>
      <div className={styles.item}>
        <h2 className={styles.title}>Create New Channel</h2>
        <div className={styles.itemContainer}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.itemContainer}>
          <label className={styles.label}>URL</label>
          <input
            type="text"
            className={styles.input}
            name="url"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className={styles.itemContainer}>
          <label>Country</label>
          <select
            onChange={(e) => setCountryId(e.target.value)}
            defaultValue="Options"
            name="country"
            className="orderInfoValue"
          >
            <option value="Options" disabled>
              Choose Country
            </option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.addButton} onClick={handleCreate}>
          Create
        </button>
        {onFinish && (
          <span
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              textAlign: "center",
              color: "green",
            }}
          >
            Channel has been created. Check{" "}
            <span
              style={{
                fontWeight: 700,
                color: "darkgreen",
                textDecoration: "underline",
              }}
            >
              <Link href={`/admin/countries/${countryId}`} passHref>
                List
              </Link>
            </span>
          </span>
        )}{" "}
        {error && (
          <span
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              textAlign: "center",
              color: "crimson",
            }}
          >
            Something went wrong.
          </span>
        )}
      </div>
      <div className={styles.item}>
        <h4>Add new Tag</h4>
        <div className={styles.form}>
          <input
            className={styles.inputTag}
            type="text"
            placeholder="insert tag"
            onChange={(e) => setTag(e.target.value)}
          />
          <button onClick={handleTag} className={styles.addButton}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";
  const res = await axiosInstance.get(`/countries/admin`);
  if (myCookie.token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      channels: res.data,
    },
  };
};
