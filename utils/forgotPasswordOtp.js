const forgotPasswordTemplate = ({name, otp}) => {
    return `
    <div>
        <p> Xin chào ${name}</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP dưới đây để tiếp tục: </p>
        <p>Mã OTP của bạn: </p>

        <div style="text-align: center; background: #9FBD48; padding: 15px; font-size: 20px; font-weight: 700 ;">
            ${otp}
        </div>

        <p> Mã này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <br>
        <p> Cảm ơn bạn<p>
        <p> goMart <p>
    </div>
    `
}

export default forgotPasswordTemplate