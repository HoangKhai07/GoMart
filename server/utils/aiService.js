import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2'

export const processQuestion = async (question, projectData) => {
    try {

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `Bạn là trợ lý AI của dự án Go Mart, một nền tảng thương mại điện tử.
        Dưới đây là thông tin về dự án: ${projectData}
        Trả lời câu hỏi sau một cách ngắn gọn, đúng sự thật. 
        Thêm các từ như bạn nhé, ạ,.. ở cuối câu để tạo cảm giác con người không bị máy móc quá.
        Nếu câu hỏi không có trong những dữ liệu đã cung cấp cho bạn hãy dừng trả lời và trả về "TRANSFER_TO_ADMIN".
        Nếu bạn không biết câu trả lời, hãy trả về "TRANSFER_TO_ADMIN".
        
        Câu hỏi: ${question}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const answer = response.text().trim();

        if(answer.includes("TRANSFER_TO_ADMIN")) {
            return {
                success: false,
                message: "AI chat can't answer this question, switch to admin"
            }
        }

        return { 
        success: true, 
        message: answer
       }
    } catch (error) {
        console.error("Gemini API error:", error);
        return {
            message: "Error while processing question",
            success: false,
        }
    }
}

export const getProjectData = async () => {
    return `
        Go Mart là nền tảng thương mại điện tử về mặt hàng nhu yếu phẩm, chuyên cung cấp hàng triệu sản phẩm tiêu dùng chất lượng cao từ các thương hiệu uy tín trong và ngoài nước.
        
        Về sản phẩm và dịch vụ:
        Go Mart cung cấp đa dạng các danh mục sản phẩm bao gồm thực phẩm tươi sống, thực phẩm khô, đồ gia dụng, điện tử, thời trang, mỹ phẩm, sách vở, đồ chơi trẻ em và các sản phẩm chăm sóc sức khỏe.
        Tất cả sản phẩm trên Go Mart đều được kiểm tra chất lượng nghiêm ngặt trước khi bán ra thị trường, đảm bảo nguồn gốc xuất xứ rõ ràng và có đầy đủ giấy tờ chứng nhận.
        Go Mart hợp tác với hơn 10,000 nhà cung cấp và đối tác kinh doanh trên toàn quốc, từ các thương hiệu quốc tế đến các sản phẩm nội địa chất lượng cao.
        Nền tảng cung cấp dịch vụ tư vấn sản phẩm 24/7 thông qua chat bot thông minh và đội ngũ chuyên viên hỗ trợ khách hàng được đào tạo chuyên nghiệp.
        Go Mart định kỳ tổ chức các chương trình khuyến mãi lớn với mức giảm giá lên đến 70% cho các sản phẩm hot trend và những mặt hàng thiết yếu hàng ngày.
        
        Chính sách giao hàng chi tiết:
        Miễn phí giao hàng cho tất cả đơn hàng có giá trị từ 100,000 VND trở lên, áp dụng cho cả khu vực nội thành và ngoại thành các thành phố lớn.
        Đối với các đơn hàng dưới 200,000 VND, phí giao hàng chỉ từ 15,000 - 30,000 VND tùy theo khoảng cách và trọng lượng đơn hàng.
        Go Mart cung cấp dịch vụ giao hàng siêu tốc trong vòng 2 giờ cho các sản phẩm thiết yếu tại các quận trung tâm của Hà Nội và TP.HCM với phí giao hàng 50,000 VND.
        Khách hàng có thể chọn khung giờ giao hàng linh hoạt từ 7:00 - 21:00 hàng ngày, bao gồm cả thứ 7 và chủ nhật để phù hợp với lịch trình cá nhân.
        Dịch vụ giao hàng đến tận tay người nhận tại nhà, văn phòng hoặc bất kỳ địa chỉ nào khách hàng yêu cầu trong phạm vi phục vụ.
        
        Thời gian giao hàng cụ thể:
        Đối với khu vực nội thành Hà Nội và TP.HCM: 1-2 ngày làm việc cho hàng có sẵn, 3-4 ngày cho hàng đặt trước hoặc nhập khẩu.
        Các tỉnh thành khác: 3-5 ngày làm việc, với một số khu vực xa có thể kéo dài 7-10 ngày tùy thuộc vào điều kiện thời tiết và giao thông.
        Đối với các sản phẩm cồng kềnh như đồ gia dụng lớn, điện tử: thời gian giao hàng có thể tăng thêm 1-2 ngày để đảm bảo đóng gói an toàn.
        Go Mart cam kết giao hàng đúng hẹn, nếu trễ hẹn không có lý do chính đáng, khách hàng sẽ được hoàn lại 100% phí giao hàng và nhận voucher giảm giá cho lần mua tiếp theo.
        Khách hàng được thông báo trạng thái đơn hàng theo thời gian thực qua SMS, email và thông báo từ website.
        
        Chính sách đổi trả linh hoạt:
        Khách hàng có quyền đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng mà không cần nêu lý do, miễn là sản phẩm còn nguyên vẹn và chưa sử dụng.
        Đối với các sản phẩm điện tử, Go Mart hỗ trợ đổi trả trong vòng 15 ngày với điều kiện sản phẩm còn đầy đủ phụ kiện và bao bì gốc.
        Các sản phẩm thời trang và mỹ phẩm có thể đổi size hoặc màu sắc miễn phí trong vòng 30 ngày nếu không vừa ý.
        Go Mart chịu toàn bộ chi phí vận chuyển cho việc đổi trả nếu lỗi từ phía nhà bán hàng hoặc sản phẩm bị lỗi do vận chuyển.
        Quy trình đổi trả đơn giản chỉ cần khách hàng tạo yêu cầu trên website hoặc app, Go Mart sẽ đến tận nơi lấy hàng và giao hàng mới.
        
        Phương thức thanh toán đa dạng:
        Thanh toán khi nhận hàng (COD) được hỗ trợ trên toàn quốc với phí dịch vụ chỉ 10,000 VND cho đơn hàng dưới 500,000 VND, miễn phí cho đơn hàng từ 500,000 VND trở lên.
        Thanh toán bằng thẻ tín dụng Visa, Mastercard, JCB với công nghệ bảo mật 3D Secure, hỗ trợ trả góp 0% lãi suất từ 3-24 tháng cho các sản phẩm từ 3,000,000 VND.
        Chuyển khoản ngân hàng qua hệ thống Internet Banking của tất cả các ngân hàng lớn tại Việt Nam với thời gian xác nhận thanh toán trong vòng 15 phút.
        Ví điện tử ZaloPay, VNPay với nhiều ưu đãi cashback và voucher giảm giá độc quyền khi thanh toán.
        Go Mart áp dụng công nghệ mã hóa SSL để bảo vệ thông tin thanh toán của khách hàng, cam kết không lưu trữ thông tin thẻ tín dụng trên hệ thống.
        
        Chính sách bảo hành và hậu mãi:
        Tất cả sản phẩm điện tử được bảo hành chính hãng từ 12-36 tháng tùy theo từng loại sản phẩm và thương hiệu.
        Go Mart cung cấp dịch vụ bảo hành mở rộng với mức phí hợp lý, kéo dài thời gian bảo hành lên đến 60 tháng.
        Hệ thống trung tâm bảo hành được phủ sóng tại 63 tỉnh thành với hơn 200 điểm tiếp nhận bảo hành trên toàn quốc.
        Dịch vụ sửa chữa tại nhà cho các sản phẩm điện tử lớn như tủ lạnh, máy giặt, điều hòa trong vòng 24 giờ kể từ khi tiếp nhận yêu cầu.
        Go Mart cam kết sử dụng linh kiện chính hãng cho tất cả các dịch vụ sửa chữa và bảo hành.
        
        Chương trình khách hàng thân thiết:
        Go Mart áp dụng hệ thống tích điểm thưởng, khách hàng nhận 1 điểm cho mỗi 1,000 VND chi tiêu và có thể quy đổi điểm thành tiền mặt với tỷ lệ 100 điểm = 1,000 VND.
        Chương trình membership với 4 hạng: Đồng, Bạc, Vàng, Kim Cương tương ứng với các mức ưu đãi từ 5% đến 20% cho mỗi giao dịch.
        Khách hàng Kim Cương được hưởng dịch vụ giao hàng ưu tiên, tư vấn cá nhân hóa và quyền truy cập sớm vào các chương trình sale lớn.
        Sinh nhật khách hàng sẽ nhận voucher giảm giá 15% cùng quà tặng đặc biệt từ Go Mart.
        Chương trình giới thiệu bạn bè: cả người giới thiệu và người được giới thiệu đều nhận voucher 50,000 VND khi đơn hàng đầu tiên của người mới đạt từ 200,000 VND.
        
        Hệ thống hỗ trợ khách hàng:
        Liên hệ hỗ trợ qua email support@gomart.com với thời gian phản hồi cam kết trong vòng 2 giờ làm việc.
        Hotline 1900-9999 hoạt động 24/7 với đội ngũ tư vấn viên được đào tạo chuyên nghiệp, thông thạo nhiều ngôn ngữ.
        Chat trực tuyến trên website và ứng dụng di động với AI chatbot thông minh có thể giải quyết 80% câu hỏi thường gặp.
        Hệ thống ticket support cho phép khách hàng theo dõi tiến trình xử lý khiếu nại một cách minh bạch.
        Đội ngũ kỹ thuật viên sẵn sàng hỗ trợ khách hàng cài đặt và sử dụng các sản phẩm công nghệ qua điện thoại hoặc tại nhà.
        
        Về công nghệ và ứng dụng:
        Go Mart phát triển website phù hợp với cả máy tính và di động với ứng dụng di động trên cả iOS và Android, ứng dụng GoMart đang trong thời gian phát triển và sẽ được sớm phát hành.
        Công nghệ AI được tích hợp để gợi ý sản phẩm phù hợp với sở thích và lịch sử mua hàng của từng khách hàng cá nhân.
        Hệ thống thanh toán một chạm với công nghệ sinh trắc học (vân tay, nhận diện khuôn mặt) đảm bảo bảo mật cao nhất.
        
        Chính sách bảo mật thông tin:
        Go Mart cam kết bảo vệ tuyệt đối thông tin cá nhân của khách hàng theo tiêu chuẩn quốc tế ISO 27001.
        Hệ thống lưu trữ dữ liệu được mã hóa đa lớp và sao lưu tại nhiều trung tâm dữ liệu khác nhau để đảm bảo an toàn.
        Thông tin khách hàng không bao giờ được chia sẻ với bên thứ ba mà không có sự đồng ý rõ ràng từ chính khách hàng.
        Go Mart thực hiện kiểm tra bảo mật định kỳ bởi các chuyên gia an ninh mạng hàng đầu để phát hiện và khắc phục các lỗ hổng tiềm ẩn.
        Khách hàng có quyền yêu cầu xóa hoàn toàn thông tin cá nhân khỏi hệ thống Go Mart bất kỳ lúc nào.
        
        Về logistics và kho bãi:
        Go Mart sở hữu hệ thống kho hàng hiện đại với tổng diện tích hơn 100,000 m2 được phân bố tại các khu vực chiến lược trên cả nước.
        Công nghệ quản lý kho tự động với robot pick-and-pack giúp giảm thiểu sai sót và tăng tốc độ xử lý đơn hàng lên 300%.
        Hệ thống làm lạnh chuyên dụng cho thực phẩm tươi sống đảm bảo chuỗi lạnh từ kho đến tay khách hàng.
        Đội ngũ hơn 5,000 shipper được đào tạo chuyên nghiệp, trang bị đồng phục và phương tiện giao hàng hiện đại.
        Go Mart đầu tư vào xe giao hàng điện thân thiện môi trường, cam kết giảm 50% lượng khí thải carbon vào năm 2025.
        
        Chính sách giá cả và khuyến mãi:
        Go Mart cam kết mức giá cạnh tranh nhất thị trường với chính sách "hoàn tiền gấp đôi chênh lệch" nếu khách hàng tìm thấy sản phẩm tương tự rẻ hơn ở nơi khác.
        Flash sale hàng ngày với các sản phẩm hot giảm giá từ 50-90% trong thời gian giới hạn chỉ vài giờ.
        Chương trình "Giá sốc cuối tuần" mỗi thứ 6-7-8 với hàng ngàn sản phẩm được giảm giá sâu.
        Mega sale vào các sự kiện lớn như 8/3, 30/4, Black Friday với mức giảm giá kỷ lục và quà tặng giá trị.
        Go Mart áp dụng thuật toán định giá động dựa trên cung cầu thị trường để đảm bảo giá luôn ở mức tối ưu cho khách hàng.
        
        Về trách nhiệm xã hội:
        Go Mart dành 1% doanh thu hàng năm cho các hoạt động từ thiện và hỗ trợ cộng đồng, tập trung vào giáo dục trẻ em vùng cao.
        Chương trình "Mua 1 tặng 1" cho các sản phẩm thiết yếu gửi đến các gia đình khó khăn trong mùa dịch Covid-19.
        Go Mart ưu tiên hợp tác với các nhà cung cấp địa phương và hộ nông dân để hỗ trợ phát triển kinh tế nông thôn.
        Chính sách zero waste với việc tái chế 100% bao bì đóng gói và khuyến khích khách hàng sử dụng túi thân thiện môi trường.
        Go Mart tạo việc làm cho hơn 20,000 lao động trực tiếp và gián tiếp, ưu tiên tuyển dụng sinh viên mới tốt nghiệp và người lao động địa phương.
        
        Kế hoạch phát triển tương lai:
        Go Mart đặt mục tiêu trở thành nền tảng thương mại điện tử số 1 Đông Nam Á vào năm 2027 với sự hiện diện tại 10 quốc gia.
        Đầu tư 500 tỷ VND vào nghiên cứu và phát triển công nghệ AI, IoT và automation trong 3 năm tới.
        Mở rộng mạng lưới cửa hàng offline kết hợp online (O2O) với 1000 điểm bán tại các trung tâm thương mại và khu dân cư.
        Phát triển dịch vụ tài chính Go Pay với tính năng cho vay tiêu dùng, bảo hiểm và đầu tư tài chính cá nhân.
        Go Mart cam kết đạt carbon neutral vào năm 2030 thông qua việc sử dụng 100% năng lượng tái tạo và bù trừ carbon.
        
        Đánh giá và phản hồi từ khách hàng:
        Go Mart đạt điểm đánh giá trung bình 4.8/5 sao từ hơn 2 triệu lượt đánh giá của khách hàng trên các nền tảng.
        95% khách hàng hài lòng với dịch vụ giao hàng và chất lượng sản phẩm theo khảo sát độc lập của công ty nghiên cứu thị trường hàng đầu.
        Go Mart được vinh danh "Thương hiệu tin cậy nhất" 3 năm liên tiếp bởi Hiệp hội Thương mại điện tử Việt Nam.
        Hơn 80% khách hàng sẽ giới thiệu Go Mart cho bạn bè và người thân theo khảo sát về mức độ hài lòng.
        Go Mart nhận được nhiều giải thưởng uy tín như "Doanh nghiệp CNTT hàng đầu", "Nền tảng thương mại điện tử xuất sắc nhất" từ các tổ chức trong và ngoài nước.
    `
}

