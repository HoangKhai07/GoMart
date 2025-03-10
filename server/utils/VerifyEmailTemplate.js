const verifyEmailTemplate = ({name, url}) => {
    return `
    <p> Dear ${name} </p>
    <p>Thanh you for register goMart. </p>
    <a href=${url} style = "color: white; background: #4caf50; margin-top: 10px, padding: 20px, display:block ">
        Verify Email
    </a>

    `
} 

export default verifyEmailTemplate 