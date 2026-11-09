# Trade Journal - Dark Professional App

แอปพลิเคชัน Trade Journal (Dark Professional) สำหรับบันทึก วิเคราะห์ และบริหารความเสี่ยงการเทรดในทุกตลาด (Forex, Crypto, Stocks, Indices, Commodities)

## วิธีติดตั้งและรันโปรเจกต์ (Local Computer)

1. แตกไฟล์ `trade-journal-app.zip`
2. เปิด Terminal / Command Prompt เข้าไปยังโฟลเดอร์โปรเจกต์:
   ```bash
   cd trade-journal-app
   ```
3. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
4. รันโปรเจกต์:
   ```bash
   npm run dev
   ```
5. เปิดเบราว์เซอร์ตาม URL ที่แสดงใน Terminal (เช่น `http://localhost:5173`)

## วิธี Deploy ขึ้น Vercel เพื่อเอา URL ไปเปิดในมือถือ (ฟรี)

1. อัปโหลดโฟลเดอร์โปรเจกต์นี้ขึ้น GitHub Repository ของคุณ
2. เข้าไปที่ [Vercel.com](https://vercel.com) แล้ว Log in
3. กด **Add New...** -> **Project** -> เลือก Repository ที่อัปโหลดไว้
4. กด **Deploy**
5. เมื่อ Deploy เสร็จ Vercel จะสร้าง URL (เช่น `https://my-trade-journal.vercel.app`) สามารถนำ URL นี้ไปเปิดใน Chrome/Safari บนมือถือ และกด **Add to Home Screen** ได้ทันที!
