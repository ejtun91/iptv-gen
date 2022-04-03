import { AddCircle, KeyboardBackspace, RemoveCircle } from "@material-ui/icons";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../../config";
import { countries } from "../../../data";
import styles from "../../../styles/CountryAdmin.module.css";

const CountryAdmin = ({ channelList, status }) => {
  const router = useRouter();
  const path = router.asPath.split("/")[3];
  const statusArray = status.filter((online) => online._id.country == path);
  const dispatch = useDispatch();
  const quantity = useSelector((state) => state.list?.quantity);
  const mylist = useSelector((state) => state.list);
  const [onlineStatus, setOnlineStatus] = useState("1");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  // Call this function when you want to refresh the data
  const refreshData = () => router.replace(router.asPath);

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
    type: "",
  });

  const onEdit = ({ id, type }) => {
    setInEditMode({
      status: true,
      rowKey: id,
      type: type,
    });
  };

  const handleEdit = async (rowId, channelId) => {
    try {
      await axiosInstance.put(`/edit/${channelId}`, {
        status: onlineStatus,
        title: title ? title : channelList[rowId].title,
        oldTitle: channelList[rowId].title,
      });
      refreshData();
      setInEditMode({
        status: false,
        rowKey: channelId,
        type: "edit",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLink = async (rowId, channelId) => {
    try {
      await axiosInstance.put(`/editLink/${channelId}`, {
        url: link,
        title: channelList[rowId].title,
      });
      refreshData();
      setInEditMode({
        status: false,
        rowKey: channelId,
        type: "link",
      });
    } catch (error) {
      console.log(error);
      console.log(channelList[rowId].title);
    }
  };

  const deleteChannel = async (channel) => {
    try {
      await axiosInstance.delete(`/edit/${channel._id}`, {
        data: { title: channel.title },
      });
      refreshData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <Link href={`/admin`} passHref>
        <span
          style={{
            width: "max-content",
            height: "max-content",
            cursor: "pointer",
            alignSelf: "flex-start",
            marginLeft: "3em",
            marginTop: "1em",
          }}
        >
          <KeyboardBackspace style={{ fontSize: "35px" }} />
        </span>
      </Link>
      <div className={styles.mainContainer}>
        <h1 style={{ textAlign: "center", padding: 0 }}>EDIT LISTS</h1>
        <table className={styles.table}>
          <tbody className={styles.tBody}>
            <tr className={styles.tr}>
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
            </tr>
            <tr className={styles.tr}>
              <td className={styles.td}>
                <span className={styles.spanTitle}>Total</span>
                <span className={styles.spanTitle}>Online</span>
                <span className={styles.spanTitle}>Offline</span>
              </td>
            </tr>
            <tr className={styles.tr}>
              <td className={styles.td}>
                <span className={styles.spanTitle}>{channelList.length}</span>
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
        <table className={styles.table}>
          <tbody className={styles.tBody}>
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
            {channelList.map((channel, i) => (
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
                <td className={styles.td}>
                  <div className={styles.channelName}>
                    <Image
                      height={10}
                      width={15}
                      src={countries[path - 1].img}
                    />
                    <span className={styles.channelTitle}>{channel.title}</span>
                  </div>
                  <div className={styles.downloadListInfo}>
                    <span className={styles.spanInfo}>
                      <span className={styles.live}>{channel.liveliness}</span>{" "}
                      <span className={styles.days}>{channel.days}</span>
                    </span>
                    <span className={styles.spanInfo}>
                      {channel.status === 1 ? (
                        <AddCircle style={{ fontSize: 17, color: "green" }} />
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
                    {inEditMode.status &&
                    inEditMode.rowKey === channel._id &&
                    inEditMode.type === "edit" ? (
                      <div className={styles.editContainer}>
                        <label
                          style={{ fontSize: "11px", fontWeight: "bold" }}
                          htmlFor=""
                        >
                          EDIT TITLE
                        </label>
                        <input
                          onChange={(e) => setTitle(e.target.value)}
                          type="text"
                          placeholder="title"
                        />
                        <label
                          style={{ fontSize: "11px", fontWeight: "bold" }}
                          htmlFor=""
                        >
                          EDIT STATUS
                        </label>
                        <select
                          onChange={(e) => setOnlineStatus(e.target.value)}
                          defaultValue="Options"
                          name="status"
                          className="orderInfoValue"
                        >
                          <option value="Options" disabled>
                            Choose Availability
                          </option>
                          <option value="0">Offline</option>
                          <option value="1">Online</option>
                        </select>
                        <span
                          onClick={() => handleEdit(i, channel._id)}
                          className={styles.spanBtn}
                        >
                          UPDATE DETAILS
                        </span>
                        <span
                          className={styles.spanBtn}
                          onClick={() =>
                            setInEditMode({
                              status: false,
                              rowKey: channel._id,
                              type: "edit",
                            })
                          }
                        >
                          CANCEL
                        </span>
                      </div>
                    ) : (
                      <span
                        style={{ height: "max-content" }}
                        className={styles.spanBtn}
                        onClick={() =>
                          onEdit({ id: channel._id, type: "edit" })
                        }
                      >
                        EDIT
                      </span>
                    )}
                    {inEditMode.status &&
                    inEditMode.rowKey === channel._id &&
                    inEditMode.type === "link" ? (
                      <div className={styles.editContainer}>
                        {/* <input
                          onChange={() => setTitle(channel.title)}
                          type="text"
                          name="title"
                          style={{}}
                        /> */}
                        <label
                          style={{ fontSize: "11px", fontWeight: "bold" }}
                          htmlFor=""
                        >
                          UPDATE LINK
                        </label>
                        <input
                          onChange={(e) => setLink(e.target.value)}
                          type="text"
                          name="link"
                          placeholder={channel.url}
                        />
                        <span
                          onClick={() => updateLink(i, channel._id)}
                          className={styles.spanBtn}
                        >
                          UPDATE LINK
                        </span>
                        <span
                          className={styles.spanBtn}
                          onClick={() =>
                            setInEditMode({
                              status: false,
                              rowKey: channel._id,
                              type: "link",
                            })
                          }
                        >
                          CANCEL
                        </span>
                      </div>
                    ) : (
                      <span
                        style={{ height: "max-content" }}
                        onClick={() =>
                          onEdit({ id: channel._id, type: "link" })
                        }
                        className={styles.spanBtn}
                      >
                        UPDATE LINK
                      </span>
                    )}
                    <span
                      style={{ height: "max-content" }}
                      onClick={() => deleteChannel(channel)}
                      className={styles.spanBtn}
                    >
                      DELETE
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CountryAdmin;

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";
  if (myCookie.token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
  const res = await axiosInstance.get(`/countries/${ctx.params.id}`);
  const resStatus = await axiosInstance.get(`/countries/status`);
  // const resLink = await axiosInstance.get(
  //   `/editLink/updateFile`
  // );
  return {
    props: {
      channelList: res.data,
      status: resStatus.data,
    },
  };
};
