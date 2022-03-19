import { AddCircle, RemoveCircle } from "@material-ui/icons";
import Image from "next/image";
import styles from "../styles/MyList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { countries } from "../data";
import { reset, removeFromList } from "../redux/listSlice";
import axios from "axios";
import { axiosInstance } from "../config";
import { makeStyles, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiPaginationItem-root": {
      backgroundColor: "#004e89",
      color: "white",
    },
    "& .Mui-selected": {
      backgroundColor: "transparent",
      color: "#004e89",
      border: "1px solid #004e89",
    },
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const MyList = () => {
  const quantity = useSelector((state) => state.list?.quantity);
  const dispatch = useDispatch();
  const mylist = useSelector((state) => state.list);
  const uid = useSelector((state) => state.list.uid);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);

  const handleClickSnack = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClickCopy = () => {
    setOpenCopy(true);
  };

  const handleCloseCopy = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenCopy(false);
  };

  const handleReset = async () => {
    dispatch(reset());
    try {
      await axiosInstance.post(`/countries`, { uid: uid });
      //  handleClickSnack();
    } catch (error) {
      console.log(error);
    }
  };

  const copyToClipboard = (url) => {
    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    handleClickCopy();
  };

  const downloadFile = async () => {
    const config = {
      responseType: "blob",
    };
    try {
      const response = await axiosInstance.get("/filedownload", config);
      if (response.data.error) {
        console.error(response.data.error);
      }

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      const fileName = response.headers["content-disposition"].substring(
        22,
        52
      );
      fileLink.setAttribute("download", fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChannel = async (channel) => {
    dispatch(removeFromList({ ...channel }));
    try {
      await axiosInstance.post(`/countries/${channel.country}`, {
        title: channel.title,
        uid: uid,
      });
      //   handleClickSnack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <div className={styles.downloadListContainer}>
        <h5 className={styles.title}>MY LIST ({quantity})</h5>
        <span onClick={() => downloadFile()} className={styles.spanButton}>
          DOWNLOAD
        </span>
        <span
          onClick={() =>
            copyToClipboard(`https://iptvgenerate.com/lists/mylist/${uid}.m3u`)
          }
          className={styles.spanButton}
        >
          COPY
        </span>
        <span className={styles.spanButton} onClick={handleReset}>
          CLEAR
        </span>
      </div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Channel(s) successfully deleted.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openCopy}
        autoHideDuration={3000}
        onClose={handleCloseCopy}
      >
        <Alert onClose={handleCloseCopy} severity="info">
          Channel(s) successfully copied into the clipboard.
        </Alert>
      </Snackbar>
      <table className={styles.table}>
        <tbody className={styles.tBody}>
          {mylist?.items?.map((channel, i) => (
            <tr key={i} className={styles.tr}>
              <td className={styles.td}>
                <Image
                  src={countries[channel.country - 1].img}
                  width={25}
                  height={15}
                />
                <span className={styles.countryTitle}>{channel.title}</span>
                <div className={styles.downloadChannelContainer}>
                  <span
                    className={styles.span}
                    onClick={() => handleDeleteChannel(channel)}
                  >
                    REMOVE
                  </span>
                  <span
                    onClick={() =>
                      copyToClipboard(
                        `https://iptvgenerate.com/lists/${channel.title.replace(
                          / /g,
                          "_"
                        )}.m3u`
                      )
                    }
                    className={styles.span}
                  >
                    COPY
                  </span>
                  <span className={styles.span}>
                    STATUS:{" "}
                    {channel.status === 1 ? (
                      <AddCircle style={{ fontSize: 17, color: "green" }} />
                    ) : (
                      <RemoveCircle
                        style={{ fontSize: 17, color: "crimson" }}
                      />
                    )}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyList;
