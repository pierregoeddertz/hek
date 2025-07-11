import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          HEK
        </Link>
        <ul className={styles.navList}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/news">News</Link>
          </li>
          <li>
            <span className={styles.dropdown}>
              Products
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/aeroleaf">Aeroleaf</Link>
                </li>
                <li>
                  <Link href="/smartflower">Smartflower</Link>
                </li>
              </ul>
            </span>
          </li>
        </ul>
      </nav>
    </header>
  );
}
