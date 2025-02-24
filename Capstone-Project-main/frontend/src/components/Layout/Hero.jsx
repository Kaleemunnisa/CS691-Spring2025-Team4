import React from 'react'
import heroImg from  '../../assets/hero2.webp'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className='relative'>
      <img 
      src={heroImg} 
      alt='Pace' 
      className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover'
      />
      <div className='absolute inset-0 bg-black bg-opacity-5 flex items-start justify-start'>
        <div className='text-left text-white p-6'>
          <h1 className='text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4'>
            CONGRATS! <br /> GRADS!
          </h1>
          <h2 className='text-lg text-yellow-400 md:text-3xl font-bold tracking-tighter mb-6'>
          Congratulations on your graduation from Pace University 
          </h2>
          <p className='text-2xl tracking-tighter md:text-lg mb-6'>
          Get everything you need for graduation and save money with a Grad Pack! We make graduation easy with our custom Grad Packs that offer the products you need to graduate with the products you want. Visit the Graduation Packages page to view your package options and see how you can save money! You can also purchase your items separately by visiting each product page.
          </p>
          <Link to='#' className='bg-white text-gray-950 px-6 py-2 rounded-sm text-lg'>
            Shop Now
          </Link>
        </div>
      </div>
    
    
    </section>
  )
}

export default Hero