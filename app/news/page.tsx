import styles from './page.module.css';

export default function News() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>News</h1>
      <div className={styles.newsList}>
        <article className={styles.newsItem}>
          <h2>Sample News Article</h2>
          <p>This is a sample news article for the HEK application.</p>
          <span className={styles.date}>2024-01-01</span>
        </article>
        <article className={styles.newsItem}>
          <h2>Another News Article</h2>
          <p>This is another sample news article.</p>
          <span className={styles.date}>2024-01-02</span>
        </article>
      </div>
    </div>
  );
}
