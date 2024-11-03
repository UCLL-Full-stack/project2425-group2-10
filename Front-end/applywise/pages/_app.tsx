import "../styles/globals.css"; // Use a relative path if necessary
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";

console.log("App is rendering");

export default appWithTranslation(function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
});
