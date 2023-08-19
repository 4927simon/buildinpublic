# [غيسكوس giscus][giscus]

نظام تعليقات يعمل بواسطة [مناقشات جيب هب][discussions]. دع الزوار يتركون التعليقات والتفاعلات على موقع الويب الخاص بك عبر جيت هب! مستلهم بشدة من [utterances][utterances].


- [مفتوح المصدر][repo]. 🌏
- بدون تتبع أو إعلانات ومجاني دائما. 📡 🚫
- لا يحتاج قاعدة بيانات. كل البيانات مخزنة في مناقشات جيب هب. :octocat:
- يدعم [الثيمات المخصصة][creating-custom-themes]! 🌗
- يدعم [لغات متعددة][multiple-languages]. 🌐
- [قابل للتخصيص بشكل كبير][advanced-usage]. 🔧
- يحمل التعليقات والتعديلات الجديدة بشكل تلقائي من جيت هب. 🔃
- [يمكن استضافته ذاتيا][self-hosting]! 🤳

> **ملاحظة**
> غيسكوس ما زال تحت التطوير. أيضا جيت هب ما زالوا يطورون المناقشات وواجهتها البرمجية. لذلك، بعض ميزات غيسكوس قد تتعطل أو تتغير مع الوقت.

## كيف يعمل

عندما يحمل غيسكوس تستخدم [الواجهة البرمجية للبحث في مناقشات جيت هب][search-api] لإيجاد المناقشة المرتبطة بالصفحة بناءا على طريقة ربط يتم اختيارها مثل (الرابط أو `pathname` أو `<title>` إلخ). إذا تعذر العثور على مناقشة مطابقة فسيقوم بوت غيسكوس تلقائيًا بإنشاء مناقشة في المرة الأولى التي يترك فيها أحد الأشخاص تعليقًا أو تفاعل.

للتعليق على المناقشات، يجب على الزائرين تخويل [تطبيق غيسكوس][giscus-app] [للنشر نيابة عنهم][authorization] باستخدام تدفق جيب هب OAuth. أو بدلاً من ذلك يمكن للزوار التعليق على مناقشة جيت هب مباشرةً. ويمكنك الإشراف على التعليقات على جيت هب.

[giscus]: https://giscus.app/ar
[discussions]: https://docs.github.com/en/discussions
[utterances]: https://github.com/utterance/utterances
[repo]: https://github.com/giscus/giscus
[advanced-usage]: https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md
[creating-custom-themes]: https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme
[multiple-languages]: https://github.com/giscus/giscus/blob/main/CONTRIBUTING.md#adding-localizations
[self-hosting]: https://github.com/giscus/giscus/blob/main/SELF-HOSTING.md
[search-api]: https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#search
[giscus-app]: https://github.com/apps/giscus
[authorization]: https://docs.github.com/en/developers/apps/identifying-and-authorizing-users-for-github-apps

<!-- configuration -->
<!-- end -->

---

ملف README متوفر أيضا باللغات:

- [Arabic (العربية)](README.ar.md)
- [Català](README.ca.md)
- [Deutsch](README.de.md)
- [English](README.md)
- [Esperanto](README.eo.md)
- [Español](README.es.md)
- [Persian (فارسی)](README.fa.md)
- [Français](README.fr.md)
- [עברית](README.he.md)
- [Indonesia](README.id.md)
- [Italiano](README.it.md)
- [日本語](README.ja.md)
- [한국어](README.ko.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
- [Português](README.pt.md)
- [Română](README.ro.md)
- [Русский](README.ru.md)
- [ภาษาไทย](README.th.md)
- [Türkçe](README.tr.md)
- [Tiếng Việt](README.vi.md)
- [Українська](README.uk.md)
- [简体中文](README.zh-CN.md)
- [繁體中文](README.zh-TW.md)

[![مدعوم من Vercel](public/powered-by-vercel.svg)][vercel]

[vercel]: https://vercel.com/?utm_source=giscus&utm_campaign=oss
