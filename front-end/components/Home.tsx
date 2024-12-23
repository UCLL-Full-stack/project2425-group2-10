import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation('common'); // Use the 'common' namespace

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};

export default Home;
