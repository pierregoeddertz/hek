import styles from './page.module.css';
import Hugger from '@/components/layout/hugger/Hugger';

export default function Home() {
  return (
    <>
      <Hugger style={{ height: '100vh', backgroundColor: 'pink' }}>
        <h1 className={styles.title}>Welcome to HEK</h1>
        <p className={styles.description}>This is the landing page of the HEK application.</p>
      </Hugger>

      <Hugger vluMax style={{ height: '100vh', backgroundColor: 'black' }}>
        <h1 className={styles.title}>Welcome to HEK</h1>
        <p className={styles.description}>This is the landing page of the HEK application.</p>
      </Hugger>
    </>
  );
}
