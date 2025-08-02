import { useEffect } from "react"
import { fetchData } from "../services/api"
import { useState } from "react"

const useFetch = (endpoint) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataAsync = async () => {
            setLoading(true)
            const response = await fetchData(endpoint);
            if(response.success){
                setData(response);
            }
            setLoading(false)
        }

        fetchDataAsync()

    }, [endpoint])


    return { data, loading }
}

export default useFetch