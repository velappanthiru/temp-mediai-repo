import "@/styles/globals.css";
import "@/styles/style.scss";
import Providers from "../contextApi/Providers";
import store from '../redux/store';
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import LoadingIndicator from "@/layout-component/loadingIndicator";
import Head from "next/head";



export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mediai - Your Gateway to Digital Media</title>
        <meta name="description" content="Explore the latest trends in digital media with Mediai." />
      </Head>
      <Provider store={store}>
        <Providers>
          <LoadingIndicator />
          <Component {...pageProps} />
        </Providers>
        <Toaster />
      </Provider>
    </>
  )};
