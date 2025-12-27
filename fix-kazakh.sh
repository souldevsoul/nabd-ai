#!/bin/bash

# Script to replace all Kazakh text with Arabic in NABD

cd /Users/rentamac/Documents/repos/repos/batch-6/nabd

# Common translations
sed -i '' 's/ЖАЛПЫ СҰРАУ/استفسار عام/g' app/contact/page.tsx
sed -i '' 's/ТЕХНИКАЛЫҚ ҚОЛДАУ/الدعم الفني/g' app/contact/page.tsx
sed -i '' 's/БИЗНЕС/الأعمال/g' app/contact/page.tsx
sed -i '' 's/БАСПАСӨЗ ЖӘНЕ МЕДИА/الصحافة والإعلام/g' app/contact/page.tsx
sed -i '' 's/ТРАНСЛЯЦИЯ ҚАБЫЛДАНДЫ - Жер басқаруы хабарламаңызды растады/تم استلام الرسالة - تأكيد المركز الأرضي لرسالتك/g' app/contact/page.tsx
sed -i '' 's/Байланыс Арнасы Ашық/قناة الاتصال مفتوحة/g' app/contact/page.tsx
sed -i '' 's/ЖЕР <span className="gradient-text">БАСҚАРУЫ<\/span>/المركز <span className="gradient-text">الأرضي<\/span>/g' app/contact/page.tsx
sed -i '' 's/Миссия басқарумен байланыс реттілігін бастау. Жауап уақыты: 24 сағаттық орбиталық терезе./بدء تسلسل الاتصال مع مركز التحكم. وقت الاستجابة: نافذة مدارية 24 ساعة./g' app/contact/page.tsx
sed -i '' 's/Трансляция Формасы/نموذج الإرسال/g' app/contact/page.tsx
sed -i '' 's/Байланыс Реттілігін Бастау/بدء تسلسل الاتصال/g' app/contact/page.tsx
sed -i '' 's/Шақыру Белгісі/معرّف الاستدعاء/g' app/contact/page.tsx
sed -i '' 's/атыңыз/اسمك/g' app/contact/page.tsx
sed -i '' 's/Байланыс Сілтемесі/رابط الاتصال/g' app/contact/page.tsx
sed -i '' 's/Тақырып Коды/رمز الموضوع/g' app/contact/page.tsx
sed -i '' 's/трансляция тақырыбы/موضوع الإرسال/g' app/contact/page.tsx
sed -i '' 's/Хабарлама Жүктемесі/حمولة الرسالة/g' app/contact/page.tsx
sed -i '' 's/хабарламаңызды жіберіңіз.../أرسل رسالتك.../g' app/contact/page.tsx
sed -i '' 's/Жіберілуде.../جارٍ الإرسال.../g' app/contact/page.tsx
sed -i '' 's/Трансляцияны Жіберу/إرسال الرسالة/g' app/contact/page.tsx
sed -i '' 's/Тікелей Арна/القناة المباشرة/g' app/contact/page.tsx
sed -i '' 's/миссияға маңызды байланыстар үшін/للاتصالات الحيوية للمهمة/g' app/contact/page.tsx
sed -i '' 's/Координаттар/الإحداثيات/g' app/contact/page.tsx
sed -i '' 's/таратылған миссия басқару желісі/شبكة التحكم في المهمة الموزعة/g' app/contact/page.tsx
sed -i '' 's/Байқоңыр ғарыш айлағы, Қазақстан/الرياض، المملكة العربية السعودية/g' app/contact/page.tsx
sed -i '' 's/Кеннеди ғарыш орталығы, FL/جدة، المملكة العربية السعودية/g' app/contact/page.tsx
sed -i '' 's/Гвиана ғарыш орталығы, Француз Гвианасы/الدمام، المملكة العربية السعودية/g' app/contact/page.tsx
sed -i '' 's/Жауап Терезесі/نافذة الاستجابة/g' app/contact/page.tsx
sed -i '' 's/орбиталық байланыс кестесі/جدول الاتصالات المدارية/g' app/contact/page.tsx
sed -i '' 's/Жалпы: 24 сағаттық орбита ішінде/عام: خلال 24 ساعة مدارية/g' app/contact/page.tsx
sed -i '' 's/Қолдау: 4 сағаттық терезе ішінде/الدعم: خلال نافذة 4 ساعات/g' app/contact/page.tsx
sed -i '' 's/Миссияға Маңызды: Лезде/حيوية للمهمة: فورية/g' app/contact/page.tsx
sed -i '' 's/Кәсіпорын Миссиялары/مهام المؤسسات/g' app/contact/page.tsx
sed -i '' 's/Терең ғарыш экспедициялары, арнайы жүктеме конфигурациялары, немесе ақ белгі миссия басқаруы? Біздің кәсіпорын флотымыз күтуде тұр./بعثات الفضاء العميق، تكوينات الحمولة المخصصة، أو إدارة المهام ذات العلامة البيضاء؟ أسطول المؤسسات لدينا في الانتظار./g' app/contact/page.tsx
sed -i '' 's/Флот Қолбасшылығымен Байланысу/الاتصال بقيادة الأسطول/g' app/contact/page.tsx

echo "Contact page fixed"
