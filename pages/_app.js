import "../styles/globals.css";
import Head from "next/head";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Head>
        <link
          rel="icon"
          href="https://upload.anytools.me/1713172734939favicon.ico"
        />
        <title>Fancyimg - Your Images, Perfected by Fancyimg AI</title>
      </Head>
    </>
  );
}
