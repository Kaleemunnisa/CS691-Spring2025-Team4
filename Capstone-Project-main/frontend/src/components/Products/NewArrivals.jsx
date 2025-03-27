import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollLeft, setcanScrollLeft] = useState(false);
  const [canScrollRight, setcanScrollRight] = useState(true);

  const newArrivals = [
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
    {
      id: '6',
      name: 'Cap and Gown',
      price: 200,
      images: [
        {
            url: "https://picsum.photos/500/500?random=6",
            altText: "Cap and Gown"
        }
      ]
    },
    {
      id: '7',
      name: 'Cap and Gown',
      price: 200,
      images: [
        {
            url: "https://picsum.photos/500/500?random=7",
            altText: "Cap and Gown"
        }
      ]
    },
    {
      id: '8',
      name: 'Cap and Gown',
      price: 200,
      images: [
        {
            url: "https://picsum.photos/500/500?random=8",
            altText: "Cap and Gown"
        }
      ]
    }
  ]

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if(!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth"});
  }

  // Update Scroll Buttons

  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if(container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;

      setcanScrollLeft(leftScroll > 0);
      setcanScrollRight(rightScrollable);

    }

    console.log({
      scrollLeft: container.scrollLeft,
      clientWidth: container.clientWidth,
      containerScrollWidth: container.scrollWidth,
      offsetLeft: scrollRef.current.offsetLeft,
    });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if(container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons)
    }
}, []);

  return <section className='py-16 px-4 lg:px-0'>
    <div className='container mx-auto text-center mt-10 mb-10 relative'>
      <h2 className='text-3xl font-bold mb-4'>Explore New Items</h2>
      <p className='text-lg text-gray-600 mb-8'>
      Explore the newest arrivals for graduates-everything you need for your graduation ceremony!
      </p>

      {/* Scroll Buttons */}
      <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
        <button 
        onClick={() => scroll("left")}
        disabled = {!canScrollLeft}
        className={`p-2 rounded border ${canScrollLeft ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} `}>
          <FiChevronLeft className='text-2xl'/>

        </button>
        <button 
        onClick={() => scroll('right')}
        className={`p-2 rounded border ${canScrollRight ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}` }>
          <FiChevronRight className='text-2xl'/>
        </button>
      </div>
    </div>
    {/* Scrollable Content */}
    <div 
      ref={scrollRef} 
      className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}

      >
      {newArrivals.map((product) => (
          <div key={product._id} className='min-w-[100%] sm:m-w-[50%] lg:min-w-[30%] relative'>
              <img src={product.images[0]?.url} 
                alt={product.images[0]?.altText || product.name}
                className='w-full h-[500px] object-cover rounded-lg'
                draggable="false"
                />
              <div className='absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg'>
                <Link to={`/product${product.id}`} className='block'>
                  <h4 className='font-medium'>{product.name}</h4>
                  <p className='mt-1'>${product.price}</p>
                </Link>
              </div>
          </div>
      ))}
    </div>
  </section>
}

export default NewArrivals