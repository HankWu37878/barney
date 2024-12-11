# Barney - Admin 介面執行說明

這份說明檔將指引您如何在本機端安裝並測試「Barney」的 Admin 介面。

## 如何在 localhost 安裝與測試：

### 1. Clone the repo
首先，從 GitHub 或您的版本控制系統中 Clone 專案到本地端：
```bash
git clone <repository_url>
```

### 2. 安裝依賴
在專案根目錄下安裝所有需要的依賴：
```bash
yarn install
```

### 3. 創建 `.env.local` 檔案
在專案根目錄創建一個 `.env.local` 檔案，並添加有效的 Postgres URL 以及其他必要的設定：
```bash
POSTGRES_URL=<your_postgres_url>
NEXT_PUBLIC_BASE_URL=http://localhost:3001
AUTH_SECRET="Any string you want"
```
請將 `<your_postgres_url>` 替換為您的 PostgreSQL 資料庫連接字串。

### 4. 執行資料庫遷移
執行資料庫遷移以確保資料庫結構正確：
```bash
yarn migrate
```

### 5. 啟動應用程式
最後，啟動應用程式：
```bash
yarn dev
```
如果一切順利，您的 Admin 介面將會在 `http://localhost:3001` 上運行。

---

若您遇到任何問題，請檢查 `.env.local` 設定檔中的資料庫連接是否正確，並確保所有依賴都已正確安裝。

```bash
yarn dev
```
