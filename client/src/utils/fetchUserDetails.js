import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fetchUserDetails = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) return
        
        const response = await Axios({
            ...SummaryApi.user_details
        })

        return response.data
    } catch (error) {
        console.log(error)        
    }
}

export default fetchUserDetails