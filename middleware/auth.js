const auth = (request, response, next)=>{
    try {


    } catch(error){
        return response.status(500).json({
            message: error.message || error
        })  
    }
}