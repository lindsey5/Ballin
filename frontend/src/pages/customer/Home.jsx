import { useState, useEffect } from "react";
import ProductsList from "../../components/ProductsList";
import { Helmet } from "react-helmet";
import TopProducts from "../../components/TopProducts";

const images = ['bg.jpg', 'bg (1).jpg', 'bg (2).jpg'];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="">
      <Helmet>
        <title>Ballin Life-n-Style</title>
      </Helmet>

      {/* Sliding Image */}
      <div className="w-full h-[60%] md:h-[500px] overflow-hidden relative">
        <img
          className="w-full h-full transition-all duration-700"
          src={`/${images[currentImage]}`}
          alt="Banner"
        />

        {/* Dot Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`cursor-pointer w-3 h-3 rounded-full transition-colors duration-300 ${
                currentImage === index ? "bg-purple-400" : "bg-white"
              }`}
            ></button>
          ))}
        </div>
      </div>

      <TopProducts />

      <section className="flex flex-col md:flex-row gap-20 p-10 md:h-[90vh]">
        <img className="w-[90%] md:w-1/2 h-1/2 md:h-full" src="/pic.jpg" alt="" />
        <div className="w-[90%] md:w-1/2">
          <h1 className="text-2xl md:text-3xl text-gray-700 mb-6 font-bold">About Ballin</h1>
          <p className="mb-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et mollitia quos ex, a fugit vitae minus quae, obcaecati, ipsa nulla ad veritatis asperiores facilis debitis magnam omnis esse! Veritatis, laudantium.
          </p>
          <iframe
            className="w-full h-1/2"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.699929218345!2d121.04803907507275!3d14.50190767948538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cf3ea7da25c1%3A0x2690af854f03dc9b!2sballin%20CLOTHING%20SHOP!5e0!3m2!1sen!2sph!4v1755359727004!5m2!1sen!2sph"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <ProductsList />
    </div>
  );
};

export default Home;
