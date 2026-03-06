# Firebase 設置檢查清單

## ✅ 已完成的設置

### 1. Firebase SDK 安裝
- [x] `firebase` npm 包已安裝
- [x] 所有必需的 Firebase 模塊已安裝

### 2. Firebase 配置文件
- [x] `src/config/firebase.ts` 已創建
- [x] 包含 API Key 和項目配置
- [x] 初始化 Authentication、Firestore、Storage、Analytics

### 3. 環境變數
- [x] `.env` 文件已創建
- [x] `.env.example` 已創建
- [x] 所有必需的環境變數已配置

### 4. 文檔
- [x] `FIREBASE_CONFIG.md` - Firebase 配置說明
- [x] `DEPLOYMENT_GUIDE.md` - 部署指南
- [x] `firebaseExamples.ts` - 使用示例

## 📋 後續步驟

### 在應用程式中使用 Firebase

1. **在 App.tsx 中初始化 Firebase**
```typescript
import { setupAuthListener } from './config/firebaseExamples';

useEffect(() => {
  const unsubscribe = setupAuthListener((user) => {
    // 處理用戶登錄狀態
    if (user) {
      console.log("User logged in:", user.email);
    } else {
      console.log("User logged out");
    }
  });
  
  return unsubscribe;
}, []);
```

2. **在組件中使用認證服務**
```typescript
import { loginUser, registerUser, logoutUser } from './config/firebaseExamples';

// 登錄
await loginUser(email, password);

// 註冊
await registerUser(email, password);

// 登出
await logoutUser();
```

3. **使用 Firestore 保存數據**
```typescript
import { saveCertificate, getUserCertificates } from './config/firebaseExamples';

// 保存證書
const certId = await saveCertificate({
  userId: userUid,
  name: "Achievement Certificate",
  issueDate: new Date(),
  verificationCode: "CERT-12345",
  issuer: "GIBC"
});

// 獲取用戶證書
const certificates = await getUserCertificates(userUid);
```

4. **配置 Firebase Rules**
   - 登錄 Firebase Console
   - 進入 Firestore Database
   - 更新安全規則（見部署指南）

### 部署應用

選擇一個部署方式：
- **Firebase Hosting** (推薦)
- **Vercel**
- **Netlify**
- **AWS Amplify**

參考 `DEPLOYMENT_GUIDE.md` 獲取詳細說明。

## 🔧 配置詳情

### 項目信息
- **應用暱稱**: gibc-cert
- **項目 ID**: gibc-cet
- **應用 ID**: 1:240565383245:web:2f6e7db90401c0ed0d6c04

### Firebase 服務已啟用
- ✅ Authentication (身份驗證)
- ✅ Firestore Database (數據庫)
- ✅ Cloud Storage (文件存儲)
- ✅ Analytics (分析)

## 📝 重要提醒

1. **安全**: `.env` 文件已被添加到 `.gitignore`，不要洩露 API Key
2. **API Key 範圍**: 限制 Firebase API Key 的使用範圍在 Firebase Console 中
3. **Firestore 規則**: 部署前務必配置正確的安全規則
4. **域名配置**: 在 Firebase Authentication 中添加授權域名

## 🚀 快速開發命令

```bash
# 開發模式
npm run dev

# 構建生產版本
npm run build

# 預覽構建結果
npm run preview

# 部署到 Firebase
firebase deploy
```

## 📞 支持資源

- [Firebase 文檔](https://firebase.google.com/docs)
- [Firebase 控制台](https://console.firebase.google.com/project/gibc-cet)
- [Vite + React 文檔](https://vitejs.dev/)
- [TypeScript 文檔](https://www.typescriptlang.org/)
