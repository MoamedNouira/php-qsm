# تعليمات إنشاء APK للتطبيق

## المتطلبات:
- Android SDK
- Java JDK 11 أو أحدث
- Cordova (مثبت بالفعل)

## الخطوات:

### 1️⃣ إنشاء مشروع Cordova جديد:
```bash
cordova create QuizApp com.example.quiz "PHP Senior Quiz"
cd QuizApp
```

### 2️⃣ إضافة منصة Android:
```bash
cordova platform add android
```

### 3️⃣ نسخ الملفات المبنية:
```bash
cp -r ../dist/* www/
```

### 4️⃣ بناء APK:
```bash
cordova build android --release
```

### 5️⃣ ستجد APK في:
```
QuizApp/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 6️⃣ التوقيع (اختياري):
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.keystore \
  app-release-unsigned.apk alias_name
```

### 7️⃣ نقل APK إلى الهاتف:
- انسخ الملف إلى هاتفك عبر USB
- افتح المدير وثبت التطبيق

---

## 🔷 الطريقة الأسهل الآن:
استخدم الرابط: **http://192.168.1.19:5173/**

لا تحتاج لأي خطوات معقدة! 🚀
