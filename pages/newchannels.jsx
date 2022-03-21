import { AddCircle, RemoveCircle } from "@material-ui/icons";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Featured from "../components/Featured";
import MyList from "../components/MyList";
import Notice from "../components/Notice";
import SearchBar from "../components/SearchBar";
import Tags from "../components/Tags";
import { axiosInstance } from "../config";
import { countries } from "../data";
import styles from "../styles/Country.module.css";
import Head from "next/head";
import { makeStyles, Snackbar } from "@material-ui/core";
import {
  addList,
  addListPerPage,
  removeFromList,
  reset,
} from "../redux/listSlice";
import MuiAlert from "@material-ui/lab/Alert";

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

const NewChannels = ({ channelData, tags }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.list.uid);
  const quantity = useSelector((state) => state.list?.quantity);
  const mylist = useSelector((state) => state.list);
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

  const copyToClipboard = (url) => {
    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    handleClickCopy();
  };

  useEffect(() => {
    const newFile = async () => {
      try {
        await axiosInstance.put(`/countries/83`, {
          uid: uid,
        });
      } catch (error) {
        console.log(error);
      }
    };
    newFile();
  }, []);

  useEffect(() => {
    const reloadListToFile = async () => {
      mylist.items.map(async (item) => {
        try {
          await axiosInstance.put(`/countries/status`, {
            mylist: {
              title: item.title,
              url: item.url,
            },
            uid: uid,
          });
        } catch (error) {
          console.log(error);
        }
      });
    };
    setTimeout(() => {
      mylist.items && reloadListToFile();
    }, 2000);
  }, []);

  const handleDeleteChannel = async (channel) => {
    dispatch(removeFromList({ ...channel }));
    try {
      await axiosInstance.post(`/countries/${channel.country}`, {
        title: channel.title,
        uid: uid,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = (url, fileName) => {
    axios({
      url: url,
      method: "GET",
      responseType: "blob", // important
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.log(err));
  };

  const handleClick = async (channelId) => {
    dispatch(addList({ ...channelData[channelId], quantity }));
    //   console.log({ ...channelList[channelId], quantity });
    try {
      await axiosInstance.put(`/countries`, {
        title: channelData[channelId].title,
        url: channelData[channelId].url,
        uid: uid,
      });
      handleClickSnack();
    } catch (error) {
      console.log(error);
    }
  };

  const handleList = async () => {
    dispatch(addListPerPage(channelData));
    //   const list = listPerPage(page);

    channelData.map(async (item) => {
      try {
        await axiosInstance.put(`/countries/status`, {
          mylist: {
            title: item.title,
            url: item.url,
          },
          uid: uid,
        });
        handleClickSnack();
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleListDownload = async () => {
    dispatch(addListPerPage(channelData));
    //  const list = listPerPage(page);

    channelData.map(async (item) => {
      try {
        await axiosInstance.put(`/countries/status`, {
          mylist: {
            title: item.title,
            url: item.url,
          },
          uid: uid,
        });
      } catch (error) {
        console.log(error);
      }
    });
    setTimeout(async () => {
      dispatch(reset());
      try {
        const response = await axiosInstance.post(
          "/filedownload",
          { uid: uid },
          {
            responseType: "blob",
          }
        );
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
    }, 1500);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={classes.root}
    >
      <Head>
        <title>IPTV Generator | New Channels</title>
        <meta
          name="description"
          content="iptv generator is website with thousands of channels for streaming, where you can customize your own iptv list and download it."
        />
        <meta
          name="keywords"
          content={`iptv, free m3u, free iptv playlist, best iptv channels, new channels download, iptv channels`}
        />
        {/*<!-- Google / Search Engine Tags -->*/}
        <meta itemProp="name" content={`IPTV Generator | Contact`} />
        <meta
          itemProp="description"
          content="iptv generator is website with thousands of channels for streaming, where you can customize your own iptv list and download it."
        />
      </Head>
      <Featured />
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          {/* <div className={styles.searchContainer}>
            <SearchBar />
          </div> */}
          <div className={styles.newChannelsTitle}>
            <h2>New Channels</h2>
          </div>
          <Alert
            style={{ width: "100%", marginBottom: "0.8em" }}
            variant="filled"
            severity="info"
          >
            If you are mobile user, please note that downloaded files might be
            in `MUSIC` folder on your phone because of the .m3u extension
          </Alert>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Channel(s) successfully added.
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
              <tr className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.downloadListBtns}>
                    <span
                      onClick={handleListDownload}
                      className={styles.spanButton}
                    >
                      DOWNLOAD THIS LIST
                    </span>
                    <span className={styles.spanButton} onClick={handleList}>
                      ADD TO LIST
                    </span>
                  </div>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  <div className={styles.downloadList}>
                    <span className={styles.span}>Channel</span>
                    <span className={styles.span}>Liveliness/days</span>
                    <span className={styles.span}>Status</span>
                    <span className={styles.span}>Checked</span>
                    <span className={styles.span}>HD</span>
                    <span className={styles.span}>Mbps</span>
                  </div>
                </th>
              </tr>
              {channelData
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 99)
                .map((channel, i) => (
                  <tr
                    style={{
                      backgroundColor: `${
                        mylist?.items.some((item) => item._id === channel._id)
                          ? "#c6f5ba"
                          : "white"
                      }`,
                    }}
                    key={channel._id}
                    className={styles.tr}
                  >
                    <td className={styles.td}>
                      <div className={styles.channelName}>
                        <Image
                          height={10}
                          width={15}
                          src={countries[channel.country - 1].img}
                        />
                        <span className={styles.channelTitle}>
                          {channel.title}
                        </span>
                      </div>
                      <div className={styles.downloadListInfo}>
                        <span className={styles.spanInfo}>
                          <span className={styles.live}>
                            {channel.liveliness}
                          </span>{" "}
                          <span className={styles.days}>{channel.days}</span>
                        </span>
                        <span className={styles.spanInfo}>
                          {channel.status === 1 ? (
                            <AddCircle
                              style={{ fontSize: 17, color: "green" }}
                            />
                          ) : (
                            <RemoveCircle
                              style={{ fontSize: 17, color: "crimson" }}
                            />
                          )}
                        </span>
                        <span className={styles.spanInfo}>
                          {new Date(channel.createdAt).toDateString()}
                        </span>
                        <span className={styles.spanInfo}>HD</span>
                        <span className={styles.spanInfo}>3800</span>
                      </div>
                      <div className={styles.downloadChannelContainer}>
                        {mylist?.items.some(
                          (item) => item._id === channel._id
                        ) ? (
                          <span
                            className={styles.spanBtn}
                            style={{
                              color: "white",
                              backgroundColor: "darkgreen",
                            }}
                            onClick={() => handleDeleteChannel(channel)}
                          >
                            REMOVE
                          </span>
                        ) : (
                          <span
                            className={styles.spanBtn}
                            onClick={() => handleClick(i)}
                          >
                            ADD TO LIST
                          </span>
                        )}
                        <span
                          onClick={() =>
                            copyToClipboard(
                              `https://lists.iptvgenerate.com/${channel.title.replace(
                                / /g,
                                "_"
                              )}.m3u`
                            )
                          }
                          className={styles.spanBtn}
                        >
                          COPY
                        </span>
                        <span
                          onClick={() =>
                            downloadFile(
                              `https://lists.iptvgenerate.com/${channel.title.replace(
                                / /g,
                                "_"
                              )}.m3u`,
                              `${channel.title.replace(/ /g, "_")}.m3u`
                            )
                          }
                          className={styles.spanBtn}
                        >
                          DOWNLOAD
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}

              <tr className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.downloadListBtns}>
                    <span
                      onClick={handleListDownload}
                      className={styles.spanButton}
                    >
                      DOWNLOAD THIS LIST
                    </span>
                    <span onClick={handleList} className={styles.spanButton}>
                      ADD TO LIST
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.sidebar}>
          <div className={styles.item}>
            {mylist.items.length !== 0 && <MyList />}
          </div>
          <div className={styles.item}>
            <Notice />
          </div>
          <div className={styles.item}>
            <Tags tags={tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChannels;
export const getServerSideProps = async () => {
  const res = await axiosInstance.get(`/countries`);
  const resTags = await axiosInstance.get("/tags");

  return {
    props: {
      channelData: res.data,
      tags: resTags.data,
    },
  };
};
