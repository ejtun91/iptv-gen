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
import { Pagination } from "@material-ui/lab";

import Tags from "../components/Tags";
import { axiosInstance } from "../config";
import { countries } from "../data";
import {
  addList,
  addListPerPage,
  removeFromList,
  reset,
} from "../redux/listSlice";
import styles from "../styles/Country.module.css";
import Head from "next/head";
import { makeStyles, Snackbar } from "@material-ui/core";
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

const Sports = ({ channelData, tags }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.list.uid);
  const quantity = useSelector((state) => state.list?.quantity);
  const mylist = useSelector((state) => state.list);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const pagesVisited = page * perPage;

  const listPerPage = (page) => {
    const slicedList = channelData
      .slice((page - 1) * perPage, pagesVisited)
      .map((list) => list);
    return slicedList;
  };

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

  const downloadFile = async (url, fileName) => {
    try {
      const response = await axiosInstance.put(
        "/filedownload",
        { urlPath: url },
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
      fileLink.setAttribute("download", fileName);
      fileLink.target = "_blank";
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (channelId) => {
    dispatch(addList({ ...channelData[channelId], quantity }));
    //   console.log({ ...channelList[channelId], quantity });
    console.log(channelId);
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
    dispatch(addListPerPage(listPerPage(page)));
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
    dispatch(addListPerPage(listPerPage(page)));
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
        <title>
          Sports: free iptv channels, m3u lists checked and updated daily | IPTV
          Generator
        </title>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta
          name="description"
          content="sports iptv channels daily, updated daily, tested vlc iptv streams, m3u8 link, m3u files, m3u8 playlist, download free, best lists, iptv streaming channels."
        />
        <meta
          name="keywords"
          content={`iptv, free m3u, free iptv playlist, best iptv channels, free sports m3u, free sport m3u channels, free download sports playlist`}
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Featured />
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          {/* <div className={styles.searchContainer}>
            <SearchBar />
          </div> */}
          <div className={styles.newChannelsTitle}>
            <h2>Sport Channels</h2>
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
          <Pagination
            style={{
              padding: 20,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            count={Math.ceil(channelData.length / 10)}
            onChange={(_, value) => {
              setPage(value);
              window.scroll(0, 450);
            }}
          />
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
              {channelData &&
                channelData
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
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
                          <h6
                            style={{
                              display: "inline-block",
                              marginTop: 0,
                              marginBottom: 0,
                            }}
                            className={styles.channelTitle}
                          >
                            {channel.title}
                          </h6>
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
                            {new Date(channel.updatedAt).toDateString()}
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
                                  / /gi,
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
                                  / /gi,
                                  "_"
                                )}.m3u`,
                                `${channel.title.replace(/ /gi, "_")}.m3u`
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
          <Pagination
            style={{
              padding: 20,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            count={Math.ceil(channelData.length / 10)}
            onChange={(_, value) => {
              setPage(value);
              window.scroll(0, 450);
            }}
          />
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

export default Sports;
export const getServerSideProps = async () => {
  const res = await axiosInstance.get(`/countries/83`);
  const resTags = await axiosInstance.get("/tags");

  return {
    props: {
      channelData: res.data,
      tags: resTags.data,
    },
  };
};
