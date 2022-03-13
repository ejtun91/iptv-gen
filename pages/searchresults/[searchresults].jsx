import Image from "next/image";
import Notice from "../../components/Notice";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import Tags from "../../components/Tags";
import Featured from "../../components/Featured";
import styles from "../../styles/Country.module.css";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { countries } from "../../data";
import { useDispatch } from "react-redux";
import {
  addList,
  addListPerPage,
  removeFromList,
  reset,
} from "../../redux/listSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import MyList from "../../components/MyList";
import { axiosInstance } from "../../config";
import { Snackbar } from "@material-ui/core";
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

const SearchResults = ({ status, searchList, tags }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const { search } = router.query;
  const path = router.asPath.split("/")[2];
  const statusArray = status.filter((online) => online._id.country == path);
  const dispatch = useDispatch();
  const quantity = useSelector((state) => state.list?.quantity);
  const mylist = useSelector((state) => state.list);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const classes = useStyles();
  const uid = useSelector((state) => state.list.uid);
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

  const perPage = 10;
  const pagesVisited = page * perPage;

  const listPerPage = (page) => {
    const slicedList = searchList
      .slice((page - 1) * perPage, pagesVisited)
      .map((list) => list);
    return slicedList;
  };

  // console.log(searchList);

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
        await axiosInstance.put(`/countries/${path}`, {
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
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.log(err));
  };

  const handleClick = async (channelId) => {
    dispatch(addList({ ...searchList[channelId], quantity }));
    //   console.log({ ...searchList[channelId], quantity });
    console.log(channelId);
    try {
      await axiosInstance.put(`/countries`, {
        title: searchList[channelId].title,
        url: searchList[channelId].url,
        uid: uid,
      });
      handleClickSnack();
    } catch (error) {
      console.log(error);
    }
  };

  const handleList = async () => {
    dispatch(addListPerPage(listPerPage(page)));
    const list = listPerPage(page);

    list.map(async (item) => {
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
    const list = listPerPage(page);

    list.map(async (item) => {
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
      downloadFile(
        `http://localhost:3000/lists/mylist/${uid}.m3u`,
        "mylist.m3u"
      );
      dispatch(reset());
      try {
        await axiosInstance.post(`/countries`, {
          uid: uid,
        });
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
      <Featured />
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.searchContainer}>
            <SearchBar query={query} setQuery={setQuery} />
          </div>
          <table className={styles.table}>
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
            <tbody className={styles.tBody}>
              {/* <tr className={styles.tr}>
                <td className={styles.td}>
                  <Image
                    className={styles.imgCountry}
                    height={10}
                    width={15}
                    src={countries[path - 1].img}
                  />
                  <span className={styles.countryTitle}>
                    {countries[path - 1].name.toUpperCase()}
                  </span>
                </td>
              </tr> */}
              <tr className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.spanTitle}>Total</span>
                  <span className={styles.spanTitle}>Online</span>
                  <span className={styles.spanTitle}>Offline</span>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.spanTitle}>{searchList.length}</span>
                  <span className={styles.spanTitle}>
                    {statusArray?.filter((s) => s._id.status === 1)[0]?.count
                      ? statusArray?.filter((s) => s._id.status === 1)[0]?.count
                      : 0}
                  </span>
                  <span className={styles.spanTitle}>
                    {statusArray?.filter((s) => s._id.status === 0)[0]?.count
                      ? statusArray?.filter((s) => s._id.status === 0)[0]?.count
                      : 0}
                  </span>
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
            count={Math.ceil(searchList.length / 10)}
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
                      onClick={() =>
                        searchList.length !== 0 && handleListDownload()
                      }
                      className={styles.spanButton}
                    >
                      DOWNLOAD THIS LIST
                    </span>
                    <span
                      onClick={() => handleList()}
                      className={styles.spanButton}
                    >
                      ADD ALL CHANNELS ON THE PAGE {page}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>
                  <div className={styles.downloadList}>
                    <span className={styles.span}>Channel</span>
                    <span className={styles.span}>Health/days</span>
                    <span className={styles.span}>Status</span>
                    <span className={styles.span}>Updated At</span>
                    <span className={styles.span}>HD</span>
                    <span className={styles.span}>Mbps</span>
                  </div>
                </th>
              </tr>
              {searchList &&
                searchList
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((channel, i) => (
                    <tr
                      key={channel._id}
                      style={{
                        backgroundColor: `${
                          mylist?.items.some((item) => item._id === channel._id)
                            ? "#c6f5ba"
                            : "white"
                        }`,
                      }}
                      className={styles.tr}
                    >
                      {console.log(channel)}
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
                              onClick={() =>
                                handleClick(i + page * perPage - 10)
                              }
                            >
                              ADD TO LIST
                            </span>
                          )}
                          <span
                            onClick={() =>
                              copyToClipboard(
                                `http://localhost:3000/lists/${channel.title.replace(
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
                                `http://localhost:3000/lists/${channel.title.replace(
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
                      onClick={() =>
                        searchList.length !== 0 && handleListDownload()
                      }
                      className={styles.spanButton}
                    >
                      DOWNLOAD THIS LIST
                    </span>
                    <span
                      onClick={() => handleList()}
                      className={styles.spanButton}
                    >
                      ADD ALL CHANNELS ON THE PAGE {page}
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
            count={Math.ceil(searchList.length / 10)}
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
export default SearchResults;

export const getServerSideProps = async ({ params }) => {
  const res = await axiosInstance.get(`/s?search=${params.searchresults}`);
  const resStatus = await axiosInstance.get(`/countries/status`);
  const resTags = await axiosInstance.get("/tags");
  return {
    props: {
      searchList: res.data,
      status: resStatus.data,
      tags: resTags.data,
    },
  };
};
