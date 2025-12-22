def prompt_template():
    template = """
    ----------------------------------------
    ### Lịch sử trò chuyện:
    Dưới đây là lịch sử trò chuyện trước đây giữa bạn và khách hàng:
    {formatted_history}
    ----------------------------------------
    ### Thông tin khách hàng:
    Dưới đây là thông tin hiện có về khách hàng (Nếu không có, mục này sẽ để trống):
    {formatted_user}
    **Lưu ý:** Không sử dụng thông tin cá nhân của khách hàng khi trả lời, trừ khi khách hàng yêu cầu.
    ----------------------------------------
    ### Câu hỏi khách hàng:
    Đây là câu hỏi mà khách hàng vừa nhập (có thể chứa lỗi chính tả hoặc ngữ pháp):
    {question}
    ----------------------------------------
    ### Câu hỏi tương tự:
    Ba câu hỏi tương tự được liệt kê để giúp bạn trả lời chính xác hơn:
    {similar_question}
    ----------------------------------------
    ### Câu trả lời: 
    """

    return template