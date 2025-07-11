import styles from './Product.module.css'

interface ProductProps {
  productName: string;
  description: string;
  features: string[];
}

export default function Product({ productName, description, features }: ProductProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{productName}</h1>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.features}>
        <h2>Features:</h2>
        <ul className={styles.featureList}>
          {features.map((feature, index) => (
            <li key={index} className={styles.featureItem}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  )
} 