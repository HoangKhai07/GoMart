import toast from "react-hot-toast";

const AxiosToastArror = (error) => {
    toast.error(
        error?.response?.data?.message
    )
}

export default AxiosToastArror