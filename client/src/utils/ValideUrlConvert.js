export const ValideUrlConvert = (name) => {
    const url = name.toString().replaceAll(" ", "-").replaceAll(",","-").replaceAll("&","-")
    return url
} 
