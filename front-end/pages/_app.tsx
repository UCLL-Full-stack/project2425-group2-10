import "@styles/globals.css";
import { appWithTranslation } from 'next-i18next';
import router from "next/router";
import React from "react";

function MyApp({ Component, pageProps }: any) {
  // Check saved language preference on initial load
  React.useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      router.push(router.asPath, router.asPath, { locale: savedLang });
    }
  }, []);

  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);