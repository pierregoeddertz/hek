import Product from '../Product'

export default function SmartflowerPage() {
  const smartflowerData = {
    productName: 'Smartflower',
    description: 'Intelligent solar energy system that follows the sun for maximum efficiency.',
    features: [
      'Sun-tracking technology',
      'Automatic deployment and retraction',
      'High solar panel efficiency',
      'Smart monitoring system',
      'Weather-resistant design'
    ]
  }

  return <Product {...smartflowerData} />
} 