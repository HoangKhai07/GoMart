import SummaryApi from "../common/SummaryApi";
import Axios from "./Axios";

  
const fetchUserDetails = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken || accessToken === 'undefined') return null
        
        const response = await Axios({
            ...SummaryApi.user_details
        })

        return response.data
    } catch (error) {
        console.log("Error fetching user details:", error)
    }
}

export default fetchUserDetails