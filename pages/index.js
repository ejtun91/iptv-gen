import axios from "axios";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import CountryList from "../components/CountryList";
import Featured from "../components/Featured";
import Sidebar from "../components/Sidebar";
import { axiosInstance } from "../config";
import styles from "../styles/Home.module.css";

export default function Home({ channels, tags }) {
  const [query, setQuery] = useState("");
  return (
    <div className={styles.container}>
      <Head>
        <title>IPTV Generator</title>
        <meta
          name="description"
          content="iptv generator is website with thousands of channels for streaming, where you can customize your own iptv list and download it."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="iptv, free m3u, free iptv playlist, best iptv channels, download free m3u channels, m3u iptv playlist 2022"
        />
        {/*<!-- Google / Search Engine Tags -->*/}
        <meta itemProp="name" content="IPTV Generator" />
        <meta
          itemProp="description"
          content="iptv generator is website with thousands of channels for streaming, where you can customize your own iptv list and download it."
        />
        <meta itemProp="image" content="" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Script
        id="google-analytics"
        src="https://www.googletagmanager.com/gtag/js?id=G-7SRLLS8G8E"
        onLoad={() => {
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "G-7SRLLS8G8E");
        }}
      />
      <Featured />
      <div className={styles.mainContainer}>
        <CountryList query={query} setQuery={setQuery} />
        <Sidebar tags={tags} channels={channels} />
      </div>
    </div>
  );
}
export const getServerSideProps = async () => {
  const res = await axiosInstance.get(`/countries`);
  const resTags = await axiosInstance.get("/tags");
  return {
    props: {
      channels: res.data,
      tags: resTags.data,
    },
  };
};
