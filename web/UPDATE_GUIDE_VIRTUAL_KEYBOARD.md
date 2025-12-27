# Hướng Dẫn Cập Nhật & Sử Dụng Bàn Phím Ảo (Virtual Keyboard)

Tài liệu này mô tả chi tiết các thay đổi đã được thực hiện để tích hợp bàn phím ảo vào giao diện Chat, phục vụ cho các thiết bị cảm ứng hoặc Kiosk không có bàn phím vật lý.

## 1. Mục Đích
Tích hợp bàn phím ảo (`react-simple-keyboard`) vào khu vực nhập liệu (`ChatInputArea`) để người dùng có thể nhập văn bản trực tiếp trên màn hình.

## 2. Thư Viện Sử Dụng
Chúng ta đã cài đặt thêm thư viện sau vào `package.json`:
- **Thư viện:** `react-simple-keyboard`
- **Phiên bản:** (Mới nhất tại thời điểm cài đặt)
- **Lệnh cài đặt:** 
  ```bash
  pnpm add react-simple-keyboard
  ```
- **CSS:** `react-simple-keyboard/build/css/index.css` (được import để hiển thị giao diện mặc định).

## 3. Chi Tiết File Thay Đổi
- **File:** `d:\MEDIC\dify\dify\web\app\components\base\chat\chat\chat-input-area\index.tsx`
- **Mô tả thay đổi:**
  1.  **Import:** Thêm thư viện Keyboard và CSS của nó.
  2.  **State Management (Quản lý trạng thái):**
      - `showKeyboard`: Biến boolean để kiểm soát việc ẩn/hiện bàn phím.
      - `layoutName`: Biến string để chuyển đổi giữa chế độ phím thường (`default`) và phím Shift (`shift`).
  3.  **Hàm Xử Lý Sự Kiện:**
      - `onKeyboardChange`: Cập nhật nội dung trong ô nhập liệu (`query`) khi người dùng nhấn phím ảo.
      - `onKeyboardKeyPress`: Xử lý các phím chức năng đặc biệt:
        - `{shift}` / `{lock}`: Chuyển đổi chế độ viết hoa/thường.
        - `{enter}`: Gửi tin nhắn.
  4.  **Tương Tác UI:**
      - Thêm sự kiện `onFocus` vào thẻ `<Textarea>`: Khi người dùng chạm vào ô nhập liệu, `showKeyboard` được set thành `true` để mở bàn phím.
      - Thêm khu vực hiển thị bàn phím ở cuối trang (`fixed bottom-0`).
      - Thêm nút **"Close Keyboard"** để tắt bàn phím thủ công.

## 4. Đoạn Code Quan Trọng
Dưới đây là các đoạn code chính đã được thêm vào `index.tsx`.

### Import
```tsx
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
```

### Khởi tạo State
```tsx
const [showKeyboard, setShowKeyboard] = useState(false)
const [layoutName, setLayoutName] = useState('default')
const keyboardRef = useRef<any>(null)
```

### Các Hàm Xử Lý
```tsx
// Khi nội dung bàn phím thay đổi
const onKeyboardChange = (input: string) => {
  handleQueryChange(input)
}

// Khi nhấn phím
const onKeyboardKeyPress = (button: string) => {
  // Xử lý Shift
  if (button === '{shift}' || button === '{lock}')
    setLayoutName(layoutName === 'default' ? 'shift' : 'default')

  // Xử lý Enter (Gửi tin nhắn)
  if (button === '{enter}')
    handleSend()
}
```

### Giao Diện (JSX)
Đoạn code hiển thị bàn phím được đặt ở cuối component, sử dụng `fixed positioning` để luôn nổi lên trên cùng.
```tsx
{
  showKeyboard && (
    <div className='fixed bottom-0 left-0 right-0 z-[100] bg-gray-100 p-2 text-black shadow-lg dark:bg-gray-800 dark:text-white'>
      <div className='flex justify-end p-1'>
        <button
          onClick={() => setShowKeyboard(false)}
          className='rounded bg-gray-300 px-2 py-1 text-xs text-black hover:bg-gray-400'
        >
          Close Keyboard
        </button>
      </div>
      <Keyboard
        keyboardRef={(r: any) => (keyboardRef.current = r)}
        layoutName={layoutName}
        onChange={onKeyboardChange}
        onKeyPress={onKeyboardKeyPress}
        input={query}
      />
    </div>
  )
}
```

## 5. Hướng Dẫn Sử Dụng
1.  **Kích Hoạt:** Nhấn (hoặc chạm) vào ô nhập liệu "Gửi tin nhắn..." (Send message). Bàn phím sẽ tự động trượt lên hoặc hiện ra ở dưới đáy màn hình.
2.  **Nhập Liệu:** Nhấn các phím trên màn hình để nhập văn bản.
3.  **Viết Hoa:** Nhấn phím `Shift` (mũi tên lên) để viết hoa ký tự.
4.  **Gửi Tin:** Nhấn phím `Enter` để gửi tin nhắn đi ngay lập tức.
5.  **Đóng Bàn Phím:** Nhấn nút "Close Keyboard" màu xám ở góc phải trên của bàn phím ảo để ẩn nó đi.

## 6. Lưu Ý Khi Phát Triển Tiếp
- Nếu muốn thay đổi giao diện bàn phím (màu sắc, kích thước), hãy chỉnh sửa hoặc override các class CSS của `react-simple-keyboard` hoặc sửa trực tiếp `className` của thẻ `div` bao ngoài.
- Để thêm các layout ngôn ngữ khác (Tiếng Việt, v.v.), tham khảo tài liệu của `react-simple-keyboard` phần `layout`.
