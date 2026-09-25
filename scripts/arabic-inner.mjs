const text=($,selector,value)=>$(selector).text(value);
const html=($,selector,value)=>$(selector).html(value);
const firstText=($,selector,value)=>$(selector).contents().filter((_,node)=>node.type==='text').first().replaceWith(value);

export function translateArabicFounder($){
  $('.founder-nav__brand').attr('aria-label','BRAYROAI الرئيسية');
  $('.founder-nav nav').attr('aria-label','أقسام صفحة المؤسس');
  $('.founder-nav nav a').each((i,element)=>$(element).text(['القصة','المبادئ','المنهج','تواصل'][i]));
  firstText($,'.founder-nav__back','الصفحة الرئيسية ');
  text($,'.founder-hero__copy .eyebrow','ياش غانيش / المؤسس');
  firstText($,'.founder-hero__copy>a','اكتشف طريقة تفكير الاستوديو ');
  text($,'.founder-hero__reveal span','أظهر ألوان الصورة الأصلية');
  text($,'.founder-hero__note','حرّك المؤشر فوق الصورة لإظهار ألوانها الأصلية');
  $('.founder-hero__image--mono').attr('alt','ياش غانيش، مؤسس BRAYROAI');

  text($,'#story .eyebrow','لماذا أُنشئت BRAYROAI');
  html($,'#story h2','تفقد الأفكار الجيدة قوتها عند <em>تشتت التنفيذ.</em>');
  const story=['عندما تُعامل الاستراتيجية والتصميم والتطوير كأعمال منفصلة، يصبح الناتج غالباً حلاً وسطاً لم يرده أحد.','أسس ياش BRAYROAI على مبدأ مختلف: فهم العمل، وتوجيه التجربة، وتحمل مسؤولية ما يصل فعلاً إلى المتصفح.','العمل قريب ومباشر ومسؤول. كل قرار بصري يجب أن ينجح مع التفاعل والأداء والجهاز الحقيقي بين يدي المستخدم.'];
  $('#story .story__copy>p').each((i,element)=>{if(story[i])$(element).text(story[i])});
  $('#story .story__copy>div span').each((i,element)=>$(element).text(['المقر','نعمل في'][i]));
  $('#story .story__copy>div b').each((i,element)=>$(element).text(['بونه، الهند','التصميم · الواجهات · ذكاء مفيد'][i]));

  text($,'#principles .eyebrow','مبادئ العمل');
  html($,'#principles h2','ما الذي ينبغي<br>للعمل أن <em>يحققه.</em>');
  $('.principle-instrument__choices').attr('aria-label','استكشف مبادئ المؤسس');
  $('.principle-instrument__choices button').each((i,element)=>{
    const button=$(element);button.contents().filter((_,node)=>node.type==='text').first().replaceWith(['الوضوح قبل المظهر','حرفية تظهر في الكود','تقنية لها فائدة'][i]);
  });
  text($,'[data-principle-index]','٠١ / الوضوح');
  text($,'[data-principle-title]','اجعل القرار واضحاً قبل أن تجعله جميلاً.');
  text($,'[data-principle-copy]','ينبغي أن يعرف الزائر ما المهم ولماذا وما خطوته التالية. يقوي التصميم هذا البناء ولا يحل محله.');

  $('.method__image img').attr('alt','مشهد فني يجمع عناصر رقمية وطاولة عمل تصميمية من BRAYROAI');
  text($,'.method__image figcaption','يبقى التوجيه والتنفيذ في مساحة واحدة');
  text($,'#method .eyebrow','المنهج');
  text($,'#method h2','التوجيه والتنفيذ في مسار واحد.');
  const method=[['اعثر على المشكلة الحقيقية.','ابدأ بالشركة والجمهور والقرار الذي يجب أن يجعل الموقع اتخاذه أسهل.'],['ابنِ وجهة النظر.','حوّل هذا الفهم إلى تسلسل واضح ولغة وصورة وحركة ونظام للواجهة.'],['اختبره داخل المتصفح.','نفّذ واختبر وصقل حتى تعمل الفكرة بأحجام وسرعات وطرق إدخال حقيقية.']];
  $('#method ol li').each((i,element)=>{const copy=method[i];if(copy){$(element).find('b').text(copy[0]);$(element).find('p').text(copy[1])}});
  text($,'.conviction blockquote p','«يبدو أفضل عمل رقمي بديهياً بعد رؤيته، لأن القرارات الصعبة اتُخذت بعناية قبل وصولك إليه.»');
  text($,'.conviction blockquote footer','ياش غانيش / BRAYROAI');

  text($,'.founder-close .eyebrow','اعمل مباشرة مع المؤسس');
  html($,'.founder-close h2','أخبرنا بالطموح.<br>وسنجد له الشكل المناسب.');
  const links=['ابدأ مشروعاً ','شاهد الخطط أولاً ','GitHub '];
  $('.founder-close__copy>div>a').each((i,element)=>firstText($,$(element),links[i]));
  text($,'.founder-close__note','يبدأ بريد المشروع بموجز قصير؛ ما عليك سوى إضافة التفاصيل المفيدة.');
  text($,'.founder-close footer span','ياش غانيش / مؤسس BRAYROAI');
  $('.founder-close footer a').each((i,element)=>$(element).text(['شاهد الخطط','الشروط','الصفحة الرئيسية'][i]));
}

export function translateArabicClientArchive($){
  $('.client-nav nav a').each((i,element)=>{const label=['العملاء','FakhriMart','الخدمات','الخطط'][i];if(label)$(element).text(label)});
  text($,'.client-hero .client-kicker','BRAYROAI / أعمال العملاء');
  text($,'.client-hero__aside>p','مساحة دائمة لأعمال العملاء مع BRAYROAI. تبقى المشاريع المنشورة منفصلة عن تجارب الاستوديو، ولا تذكر دراسات الحالة إلا ما يمكن التحقق منه.');
  $('.client-hero__stats').attr('aria-label','حالة أعمال العملاء');
  $('.client-hero__stats span').each((i,element)=>$(element).text(['مشروع عميل منشور وموثق','بداية أرشيف الأعمال'][i]));
  text($,'.client-index__bar .client-kicker','الفهرس / الأعمال الحالية والقادمة');
  text($,'#client-index-title','فهرس مشاريع العملاء');
  $('.client-filters').attr('aria-label','صفّ مشاريع العملاء حسب الحالة');
  $('.client-filters button').each((i,element)=>$(element).text(['الكل','منشور'][i]));
  text($,'.client-search .sr-only','ابحث في مشاريع العملاء');
  $('[data-client-search]').attr('placeholder','ابحث في أعمال العملاء').attr('aria-label','ابحث في أعمال العملاء');
  text($,'[data-client-count]','مشروع واحد');
  text($,'.client-empty strong','لا توجد مشاريع تطابق البحث حالياً.');
  text($,'.client-empty p','جرّب بحثاً آخر. سيكبر هذا الأرشيف مع نشر أعمال موثقة جديدة.');
  text($,'[data-client-reset]','امسح البحث');
  text($,'.client-publishing .client-kicker','كيف يكبر الأرشيف');
  text($,'.client-publishing h2','أرشيف يبقى مفيداً بعد دراسة الحالة الأولى.');
  const rules=[
    ['يبقى عمل العملاء الموثق منفصلاً.','لا تُقدَّم تجارب BRAYROAI الداخلية أو الدراسات التصورية بوصفها دليلاً على عمل لعميل. هكذا يظل الأرشيف مفيداً مع إضافة مشاريع جديدة.'],
    ['لكل مشروع معلومات أساسية متسقة.','تُسجل الحالة والسنة والقطاع والموقع والدور والخدمات ودراسة الحالة ورابط الموقع المباشر في بنية واحدة، فلا تحتاج الإضافات القادمة إلى إعادة تصميم الصفحة.'],
    ['يمكن عرض العمل الجاري من دون الادعاء بأنه مكتمل.','يدعم الأرشيف حالات العمل الجاري والقادم، لكن دراسة الحالة المفصلة لا تُنشر إلا عند توفر أدلة معتمدة كافية لشرح العمل.'],
    ['لا نختلق أرقام النتائج.','إذا لم يقدم العميل نتائج قابلة للقياس، توثق دراسة الحالة التصميم والنظام والإطلاق والقرارات المؤكدة بدلاً من اختراع نسب تحسن.']
  ];
  $('.client-publishing__rule').each((i,element)=>{const copy=rules[i];if(copy){$(element).find('strong').text(copy[0]);$(element).find('p').text(copy[1])}});
  text($,'.client-close .client-kicker','التالي / مشروعك');
  text($,'.client-close h2','لنجعل المشروع القادم جديراً بالنشر.');
  html($,'.client-close__action','ابدأ<br>مشروعاً ↗');
  text($,'.client-footer span','BRAYROAI / أعمال العملاء');
  $('.client-footer a').each((i,element)=>$(element).text(['الصفحة الرئيسية','الخطط','الشروط'][i]));
}

export function translateArabicCaseIntro($){
  $('.client-nav nav a').each((i,element)=>{const label=['العملاء','FakhriMart','الموقع المباشر ↗','الخطط'][i];if(label)$(element).text(label)});
  text($,'.case-reading [data-case-state]','الموجز');
  text($,'.case-hero .client-kicker','عميل موثق / ٢٠٢٦ / بونه · الهند');
  $('.case-hero__meta small').each((i,element)=>$(element).text(['العميل','القطاع','الدور','الحالة'][i]));
  $('.case-hero__meta strong').each((i,element)=>{const copy=['FakhriMart','توريد الخيوط والحرف','التخطيط ← الإطلاق','منشور'][i];if(copy)$(element).text(copy)});
  $('.case-hero__actions a').each((i,element)=>$(element).text(['شاهد الموقع المباشر ↗','جميع أعمال العملاء'][i]));
  $('.case-hero__media>img').attr('alt','واجهة كتالوج FakhriMart على الحاسوب');
  $('.case-hero__phone img').attr('alt','واجهة FakhriMart على الهاتف');
  // Preserve the approved factual narrative in English until its translation
  // can be reviewed against the client's original case study.
  $('#approach,#experience,.case-section,.case-outcome').attr('lang','en').attr('dir','ltr');
  $('.case-hero__lead').append('<p class="market-legal-note">تتابع دراسة الحالة التفصيلية باللغة الإنجليزية للحفاظ على دقة وصف العمل المنشور. الملخص: صممنا تجربة كتالوج تساعد الزائر على اكتشاف الخيوط والمواد الحرفية، ثم إرسال استفسار واضح لتأكيد اللون والتوفر والكمية والسعر الحالي مع المتجر.</p>');
}

export function translateArabicTerms($){
  $('.terms-nav nav a').each((i,element)=>$(element).text(['الخدمات','الدفعات','الملكية','المسؤولية'][i]));
  text($,'.terms-hero .eyebrow','BRAYROAI / الشروط والأحكام');
  $('.terms-meta span').each((i,element)=>$(element).text(['سارية من ٢٤ أغسطس ٢٠٢٦','بونه، ماهاراشترا، الهند','الإصدار ١٫٠'][i]));
  $('.terms-toc').attr('aria-label','فهرس الشروط');
  text($,'.terms-toc>small','الفهرس / ١٢ قسماً');
  const sections=['الخدمات','الأسعار والخطط','الدفعات','النطاق والتعديلات','الجدول الزمني','مسؤوليات العميل','الخدمات الخارجية','الملكية','الإلغاء','الضمان والدعم','المسؤولية','أحكام عامة'];
  $('.terms-toc nav a').each((i,element)=>$(element).text(`${String(i+1).padStart(2,'0')} ${sections[i]}`));
  text($,'.terms-intro strong','الشروط التعاقدية الرسمية أدناه باللغة الإنجليزية.');
  text($,'.terms-intro p','الملخص العربي للتيسير فقط، ولا يحل محل النص الإنجليزي أو العرض المكتوب الخاص بالمشروع. اقرأ البنود كاملة قبل الموافقة على العمل.');
  text($,'.terms-quick small','ابدأ هنا / إجابات عملية');
  text($,'.terms-quick h2','أربع نقاط مهمة قبل بدء العمل.');
  const quick=[
    ['كيف تتم الدفعات؟','يُتفق على مواعيد الدفع كتابةً؛ وقد يستخدم المشروع دفعة مقدمة أو مراحل.'],
    ['هل يمكن تغيير النطاق؟','نعم. تُحدد الإضافات الجوهرية قبل أن تؤثر في السعر أو الجدول الزمني.'],
    ['متى تنتقل ملكية العمل؟','تنتقل مخرجات المشروع المخصصة والمعتمدة بعد سداد الرسوم المتفق عليها.'],
    ['هل يشمل السعر النطاق والاستضافة؟','هما منفصلان ما لم ينص العرض المكتوب على شمولهما.']
  ];
  $('.terms-quick__grid a').each((i,element)=>{const copy=quick[i];if(copy){$(element).find('strong').text(copy[0]);$(element).find('p').text(copy[1])}});
  // Keep the original legal clauses and their direction intact. Arabic
  // headings and quick answers are navigation aids pending legal review.
  $('.terms-section').removeAttr('lang').removeAttr('dir');
  $('.terms-section>p,.terms-section>ul,.terms-section .terms-card').attr('lang','en').attr('dir','ltr');
  $('.terms-section__num').each((i,element)=>$(element).text(`${String(i+1).padStart(2,'0')} / ${sections[i]}`));
  text($,'.terms-close>small','أسئلة عن النطاق أو الشروط؟');
  text($,'.terms-close h2','وضحها قبل بدء العمل.');
  firstText($,'.terms-close>a:first-of-type','اسأل عبر واتساب ');
  firstText($,'.terms-close__email','تفضل البريد؟ اسأل عن الشروط ');
  $('.terms-footer span').each((i,element)=>$(element).text(['BRAYROAI / الشروط والأحكام','سارية من ٢٤ أغسطس ٢٠٢٦'][i]));
  $('.terms-footer a').each((i,element)=>$(element).text(['الصفحة الرئيسية','الخطط'][i]));
}
