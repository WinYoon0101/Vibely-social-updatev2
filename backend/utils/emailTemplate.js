const getEmailTemplate = (title, preheader, content) => {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #086280;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 26px;
            font-weight: 600;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.6;
            font-size: 16px;
        }
        .content p {
            margin-bottom: 20px;
        }
        .otp-box {
            background-color: #f9fdff;
            border: 2px dashed #23CAF1;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #086280;
            letter-spacing: 6px;
            margin: 0;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #888888;
            border-top: 1px solid #eeeeee;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #23CAF1;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <!-- Preheader -->
    <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        ${preheader}
    </div>
    
    <div class="container">
        <div class="header">
            <h1>VIBELY SOCIAL</h1>
        </div>
        
        <div class="content">
            ${content}
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Vibely Social. All rights reserved.</p>
            <p>Đây là email tự động, vui lòng không phản hồi lại địa chỉ này.</p>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = getEmailTemplate;
