import Layout from "../components/Layout";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>IPTV Generator</title>
        <meta
          name="description"
          content="iptv generator is website with thousands of channels for streaming, where you can customize your own iptv list and download it. Croatia IPTV, Germany IPTV, USA IPTV, UK IPTV, France IPTV, Scandinavia IPTV, Turkey IPTV, Netherlands, m3u channels free"
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
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
