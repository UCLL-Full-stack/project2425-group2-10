// components/LanguageDropdown.tsx
import React from 'react';
import { useRouter } from 'next/router';

const LanguageDropdown: React.FC = () => {
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">
        Language
      </label>
      <select
        id="language-select"
        value={router.locale}
        onChange={(e) => changeLanguage(e.target.value)}
        className="border rounded px-2 py-1"
        title="Select language" // Accessible name for screen readers
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;
