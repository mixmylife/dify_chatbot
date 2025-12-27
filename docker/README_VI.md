# Hướng dẫn triển khai Docker

Chào mừng bạn đến với thư mục `docker` mới để triển khai Dify sử dụng Docker Compose. Hướng dẫn này tóm tắt các cập nhật, hướng dẫn triển khai và chi tiết di chuyển cho người dùng hiện tại.

### Những Thay Đổi Mới

- **Container Certbot**: `docker-compose.yaml` hiện đã bao gồm `certbot` để quản lý chứng chỉ SSL. Container này tự động gia hạn chứng chỉ và đảm bảo kết nối HTTPS an toàn.\
  Để biết thêm thông tin, hãy tham khảo `docker/certbot/README.md`.

- **Biến Môi Trường Cố Định**: Các biến môi trường hiện được quản lý thông qua file `.env`, đảm bảo cấu hình của bạn được giữ nguyên qua các lần triển khai.

  > `.env` là gì? </br> </br>
  > File `.env` là một thành phần quan trọng trong môi trường Docker và Docker Compose, đóng vai trò là file cấu hình tập trung nơi bạn có thể định nghĩa các biến môi trường có thể truy cập được bởi các container khi chạy. File này đơn giản hóa việc quản lý cài đặt môi trường giữa các giai đoạn phát triển, kiểm thử và sản xuất khác nhau, mang lại sự nhất quán và dễ dàng cấu hình cho việc triển khai.

- **Dịch Vụ Cơ Sở Dữ Liệu Vector Thống Nhất**: Tất cả các dịch vụ cơ sở dữ liệu vector hiện được quản lý từ một file Docker Compose duy nhất `docker-compose.yaml`. Bạn có thể chuyển đổi giữa các cơ sở dữ liệu vector khác nhau bằng cách đặt biến môi trường `VECTOR_STORE` trong file `.env`.

- **Bắt buộc có file .env**: File `.env` hiện là bắt buộc để chạy lệnh `docker compose up`. File này rất quan trọng để cấu hình triển khai của bạn và để bất kỳ cài đặt tùy chỉnh nào được giữ nguyên qua các bản nâng cấp.

### Cách Triển Khai Dify với `docker-compose.yaml`

1. **Điều Kiện Tiên Quyết**: Đảm bảo Docker và Docker Compose đã được cài đặt trên hệ thống của bạn.
1. **Thiết Lập Môi Trường**:
   - Di chuyển đến thư mục `docker`.
   - Sao chép file `.env.example` thành một file mới tên là `.env` bằng cách chạy `cp .env.example .env`.
   - Tùy chỉnh file `.env` nếu cần. Tham khảo file `.env.example` để biết các tùy chọn cấu hình chi tiết.
1. **Chạy Các Dịch Vụ**:
   - Thực thi `docker compose up` từ thư mục `docker` để khởi động các dịch vụ.
   - Để chỉ định cơ sở dữ liệu vector, hãy đặt biến `VECTOR_STORE` trong file `.env` thành dịch vụ cơ sở dữ liệu vector mong muốn của bạn, chẳng hạn như `milvus`, `weaviate`, hoặc `opensearch`.
1. **Thiết Lập Chứng Chỉ SSL**:
   - Tham khảo `docker/certbot/README.md` để thiết lập chứng chỉ SSL bằng Certbot.
1. **Thiết Lập OpenTelemetry Collector**:
   - Đổi `ENABLE_OTEL` thành `true` trong `.env`.
   - Cấu hình `OTLP_BASE_ENDPOINT` cho phù hợp.

### Cách Triển Khai Middleware để Phát Triển Dify

1. **Thiết Lập Middleware**:
   - Sử dụng `docker-compose.middleware.yaml` để thiết lập các dịch vụ middleware thiết yếu như cơ sở dữ liệu và bộ nhớ đệm.
   - Di chuyển đến thư mục `docker`.
   - Đảm bảo file `middleware.env` được tạo bằng cách chạy `cp middleware.env.example middleware.env` (tham khảo file `middleware.env.example`).
1. **Chạy Các Dịch Vụ Middleware**:
   - Di chuyển đến thư mục `docker`.
   - Thực thi `docker compose -f docker-compose.middleware.yaml --profile weaviate -p dify up -d` để khởi động các dịch vụ middleware. (Đổi profile sang cơ sở dữ liệu vector khác nếu bạn không sử dụng weaviate)

### Di Chuyển Cho Người Dùng Hiện Tại

Đối với người dùng di chuyển từ thiết lập `docker-legacy`:

1. **Xem Lại Thay Đổi**: Làm quen với cấu hình `.env` mới và thiết lập Docker Compose.
1. **Chuyển Đổi Tùy Chỉnh**:
   - Nếu bạn có các cấu hình tùy chỉnh như `docker-compose.yaml`, `ssrf_proxy/squid.conf`, hoặc `nginx/conf.d/default.conf`, bạn sẽ cần phản ánh những thay đổi này trong file `.env` mà bạn tạo.
1. **Di Chuyển Dữ Liệu**:
   - Đảm bảo dữ liệu từ các dịch vụ như cơ sở dữ liệu và bộ nhớ đệm được sao lưu và di chuyển thích hợp sang cấu trúc mới nếu cần thiết.

### Tổng Quan Về `.env`

#### Các Module Chính và Tùy Chỉnh

- **Dịch Vụ Cơ Sở Dữ Liệu Vector**: Tùy thuộc vào loại cơ sở dữ liệu vector được sử dụng (`VECTOR_STORE`), người dùng có thể đặt các endpoint, cổng và chi tiết xác thực cụ thể.
- **Dịch Vụ Lưu Trữ**: Tùy thuộc vào loại lưu trữ (`STORAGE_TYPE`), người dùng có thể cấu hình cài đặt cụ thể cho S3, Azure Blob, Google Storage, v.v.
- **Dịch Vụ API và Web**: Người dùng có thể định nghĩa URL và các cài đặt khác ảnh hưởng đến cách API và web frontend hoạt động.

#### Các biến đáng chú ý khác

File `.env.example` được cung cấp trong thiết lập Docker rất phong phú và bao gồm nhiều tùy chọn cấu hình. Nó được cấu trúc thành nhiều phần, mỗi phần liên quan đến các khía cạnh khác nhau của ứng dụng và các dịch vụ của nó. Dưới đây là một số phần và biến chính:

1. **Biến Chung (Common Variables)**:

   - `CONSOLE_API_URL`, `SERVICE_API_URL`: URL cho các dịch vụ API khác nhau.
   - `APP_WEB_URL`: URL ứng dụng frontend.
   - `FILES_URL`: URL cơ sở để tải xuống và xem trước file.

1. **Cấu Hình Máy Chủ (Server Configuration)**:

   - `LOG_LEVEL`, `DEBUG`, `FLASK_DEBUG`: Cài đặt ghi log và gỡ lỗi.
   - `SECRET_KEY`: Khóa để mã hóa cookie phiên và dữ liệu nhạy cảm khác.

1. **Cấu Hình Cơ Sở Dữ Liệu (Database Configuration)**:

   - `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`: Thông tin đăng nhập và kết nối cơ sở dữ liệu PostgreSQL.

1. **Cấu Hình Redis (Redis Configuration)**:

   - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Cài đặt kết nối máy chủ Redis.

1. **Cấu Hình Celery (Celery Configuration)**:

   - `CELERY_BROKER_URL`: Cấu hình cho trình môi giới tin nhắn Celery.

1. **Cấu Hình Lưu Trữ (Storage Configuration)**:

   - `STORAGE_TYPE`, `S3_BUCKET_NAME`, `AZURE_BLOB_ACCOUNT_NAME`: Cài đặt cho các tùy chọn lưu trữ file như local, S3, Azure Blob, v.v.

1. **Cấu Hình Cơ Sở Dữ Liệu Vector (Vector Database Configuration)**:

   - `VECTOR_STORE`: Loại cơ sở dữ liệu vector (ví dụ: `weaviate`, `milvus`).
   - Các cài đặt cụ thể cho từng kho vector như `WEAVIATE_ENDPOINT`, `MILVUS_URI`.

1. **Cấu Hình CORS (CORS Configuration)**:

   - `WEB_API_CORS_ALLOW_ORIGINS`, `CONSOLE_CORS_ALLOW_ORIGINS`: Cài đặt chia sẻ tài nguyên nguồn gốc chéo.

1. **Cấu Hình OpenTelemetry**:

   - `ENABLE_OTEL`: Kích hoạt OpenTelemetry collector trong api.
   - `OTLP_BASE_ENDPOINT`: Endpoint cho OTLP exporter của bạn.

1. **Các Biến Môi Trường Cụ Thể Cho Dịch Vụ Khác**:

   - Mỗi dịch vụ như `nginx`, `redis`, `db`, và các cơ sở dữ liệu vector đều có các biến môi trường cụ thể được tham chiếu trực tiếp trong `docker-compose.yaml`.

### Thông Tin Bổ Sung

- **Giai Đoạn Cải Tiến Liên Tục**: Chúng tôi đang tích cực tìm kiếm phản hồi từ cộng đồng để tinh chỉnh và nâng cao quy trình triển khai. Khi có nhiều người dùng áp dụng phương pháp mới này, chúng tôi sẽ tiếp tục thực hiện các cải tiến dựa trên kinh nghiệm và đề xuất của bạn.
- **Hỗ Trợ**: Để biết các tùy chọn cấu hình chi tiết và cài đặt biến môi trường, hãy tham khảo file `.env.example` và các file cấu hình Docker Compose trong thư mục `docker`.

Bản README này nhằm hướng dẫn bạn qua quy trình triển khai sử dụng thiết lập Docker Compose mới. Nếu có bất kỳ vấn đề nào hoặc cần hỗ trợ thêm, vui lòng tham khảo tài liệu chính thức hoặc liên hệ hỗ trợ.
