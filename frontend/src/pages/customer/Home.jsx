import ProductsList from "../../components/ProductsList";
import categories from "../../contants/categories";

const Home = () => {
    return (
        <div className="">
            <div className="mt-5 flex flex-col items-center gap-5">
                <h1 className="text-2xl font-bold animate-bounce">Welcome to Ballin</h1>
                <img className="w-[90%] h-[450px]" src="/bg.jpg"/>
            </div>
            <div className="mt-10 px-10">
                <h1 className="text-3xl text-gray-700 mb-6 font-bold">Product Overview</h1>
                <div className="flex gap-5 mb-6">
                    {categories.map(c => <a className="hover:underline text-lg" href="#">{c}</a>)}
                </div>
                <ProductsList />
            </div>
        </div>
    )
}

export default Home