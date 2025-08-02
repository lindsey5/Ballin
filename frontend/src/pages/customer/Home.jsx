import ProductsList from "../../components/ProductsList";

const Home = () => {
    return (
        <div className="">
            <div className="mt-5 flex flex-col items-center gap-5">
                <h1 className="text-2xl font-bold animate-bounce">Welcome to Ballin</h1>
                <img className="w-[90%] h-[450px]" src="/bg.jpg"/>
            </div>
            <ProductsList />
        </div>
    )
}

export default Home