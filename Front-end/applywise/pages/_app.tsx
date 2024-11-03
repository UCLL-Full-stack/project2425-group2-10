import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";

export default appWithTranslation(function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
});
