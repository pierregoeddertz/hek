import Product from '../Product'

export default function AeroleafPage() {
  const aeroleafData = {
    productName: 'Aeroleaf',
    description: 'Revolutionary wind energy solution for sustainable power generation.',
    features: [
      'Advanced wind turbine technology',
      'High efficiency energy conversion',
      'Low maintenance design',
      'Environmentally friendly operation',
      'Scalable for various applications'
    ]
  }

  return <Product {...aeroleafData} />
} 