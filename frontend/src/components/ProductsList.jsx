import ProductContainer from "./ProductContainer";

  const products = [
    {
      product_name: 'T-Shirt',
      price: '$19.99',
      image: '/image/1.jpg',
    },
    {
      product_name: 'Shoes',
      price: '$49.99',
      image: '/image/1.jpg',
    },
    {
      product_name: 'Hat',
      price: '$14.99',
      image: '/image/1.jpg',
    },
    {
      product_name: 'Backpack',
      price: '$39.99',
      image: '/image/1.jpg',
    },
    {
      product_name: 'Jacket',
      price: '$89.99',
      image: '/image/1.jpg',
    },
  ];

const ProductsList = () => {
    return (
        <div className="flex flex-col items-center pb-10">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
                <ProductContainer
                    key={index}
                    product_name={product.product_name}
                    price={product.price}
                    image={product.image}
                />
            ))}
            </div>
            <button className="bg-gray-600 text-white px-5 py-1 cursor-pointer hover:underline rounded-md">Load more</button>
        </div>
    )
}

export default ProductsList