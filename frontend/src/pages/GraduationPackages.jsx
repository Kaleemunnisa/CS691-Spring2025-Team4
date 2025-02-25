import React, { useEffect, useState } from 'react'
import ProductGrid from '../components/Products/ProductGrid'; 

const GraduationPackages = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = 
        [
          {
            id: '1',
            name: 'Cap and Gown',
            price: 200,
            images: [
              {
                  url: "https://picsum.photos/500/500?random=1",
                  altText: "Cap and Gown"
              }
            ]
          },
          {
            id: '2',
            name: 'Cap and Gown',
            price: 200,
            images: [
              {
                  url: "https://picsum.photos/500/500?random=2",
                  altText: "Cap and Gown"
              }
            ]
          },
          {
            id: '3',
            name: 'Cap and Gown',
            price: 200,
            images: [
              {
                  url: "https://picsum.photos/500/500?random=3",
                  altText: "Cap and Gown"
              }
            ]
          },
          {
            id: '4',
            name: 'Cap and Gown',
            price: 200,
            images: [
              {
                  url: "https://picsum.photos/500/500?random=4",
                  altText: "Cap and Gown"
              }
            ]
          },
          {
            id: '5',
            name: 'Cap and Gown',
            price: 200,
            images: [
              {
                  url: "https://picsum.photos/500/500?random=5",
                  altText: "Cap and Gown"
              }
            ]
          },
          
          
        ]
      ; setProducts(fetchedProducts);
    }, 1000)
  }, []);
  return <div className='flex flex-col items-center justify-center text-center font-bold '>
    <h1 className='mb-4 mt-6 font-vold text-3xl'>Graduation Packages</h1>
    <p className='mb-4 mt-2 font-semibold'>
    Get everything you need for graduation with a Grad Pack! Grad Packs are your one-stop shop for essential and memorable items, conveniently bundled together.
    </p>
    <ProductGrid products={products}/>
  </div>
}

export default GraduationPackages