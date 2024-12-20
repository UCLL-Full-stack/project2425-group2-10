import { useRouter } from 'next/router';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { locales, locale, asPath } = router; // Get available locales, current locale, and current path

  const changeLanguage = (newLocale: string) => {
    router.push(asPath, asPath, { locale: newLocale }); // Change the language and refresh the page
  };

  return (
    <div className="language-switcher">
      {locales?.map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          disabled={locale === lng} // Disable the button for the current language
          className={locale === lng ? 'font-bold' : ''}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
