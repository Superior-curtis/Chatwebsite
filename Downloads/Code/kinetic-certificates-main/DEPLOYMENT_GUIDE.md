# Firebase Deployment Guide for gibc-cert

## 部署前準備

### 1. 環境變數設置
確保 `.env` 文件已配置：
```bash
VITE_FIREBASE_API_KEY=AIzaSyBY8oUUv75AKZ21RBepBgoLWdNm5A7Dwb4
VITE_FIREBASE_AUTH_DOMAIN=gibc-cet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gibc-cet
VITE_FIREBASE_STORAGE_BUCKET=gibc-cet.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=240565383245
VITE_FIREBASE_APP_ID=1:240565383245:web:2f6e7db90401c0ed0d6c04
VITE_FIREBASE_MEASUREMENT_ID=G-QL0DP656D0
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 構建應用
```bash
npm run build
```

## 部署選項

### 選項 1: Firebase Hosting 部署 (推薦)

#### 安裝 Firebase CLI
```bash
npm install -g firebase-tools
```

#### 登錄 Firebase
```bash
firebase login
```

#### 初始化 Firebase 項目
```bash
firebase init hosting
```

#### 部署到 Firebase Hosting
```bash
firebase deploy
```

### 選項 2: 使用 GitHub Actions 自動部署
創建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main, master]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: gibc-cet
```

### 選項 3: Vercel 部署
```bash
npm install -g vercel
vercel
```

### 選項 4: Netlify 部署
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 驗證部署

部署後訪問:
- **本地**: `http://localhost:5173`
- **Firebase Hosting**: `https://gibc-cet.web.app`
- **Vercel**: `https://your-project-name.vercel.app`
- **Netlify**: `https://your-site-name.netlify.app`

## Firestore 安全規則設置

在 Firebase Console 中配置 Firestore 安全規則:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /certificates/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 常見問題排除

1. **API Key 錯誤**: 確認 `.env` 文件中的 API Key 正確
2. **CORS 問題**: 在 Firebase Console 中配置授權域名
3. **認證失敗**: 檢查 Firebase Authentication 已啟用
4. **部署失敗**: 運行 `npm run build` 確保構建成功

## 監控和分析

部署後可以在 Firebase Console 監控:
- Real-time Database 使用情況
- Authentication 用戶登錄
- Hosting 訪問流量
- Analytics 用戶行為

## 回滾部署

如需回滾到之前版本:
```bash
firebase hosting:channel:list
firebase hosting:channel:delete <channel-id>
```
