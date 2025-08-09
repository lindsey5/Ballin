import { useSearchParams } from "react-router-dom";
import ProductsList from "../../components/ProductsList";

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("searchTerm");

    return(
        <div className="min-h-screen">
            <ProductsList searchTerm={search} title={search ? `Results for ${search}` : "Products"} />
        </div>
    )
}

export default ProductsPage