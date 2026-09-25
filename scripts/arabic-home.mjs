import {priceFor} from '../data/pricing.js';

const text=($,selector,value)=>$(selector).text(value);
const html=($,selector,value)=>$(selector).html(value);
const list=($,selector,values)=>$(selector).each((index,element)=>{if(values[index]!==undefined)$(element).text(values[index])});
const firstText=($,selector,value)=>$(selector).contents().filter((_,node)=>node.type==='text').first().replaceWith(value);

export function translateArabicHome($){
  $('.v12-hero-title').attr('aria-label','تجارب رقمية تترك أثراً مختلفاً');
  $('.v12-hero-meta').attr('aria-label','مجالات عمل BRAYROAI');
  list($,'.v12-hero-meta span',['تجارب الويب','تصميم المنتجات','هندسة الواجهات','أنظمة الذكاء']);
  firstText($,'.primary-action','ابدأ مشروعاً ');
  text($,'.colour-director span','أظهر الألوان');
  text($,'.hero__credit','صورة بالأبيض والأسود حتى تصبح جزءاً منها');
  list($,'.v12-signal-strip:first-of-type .v12-signal-track span',Array(2).fill(['استراتيجية','تجارب الويب','تصميم المنتجات','هندسة الواجهات','أنظمة الذكاء','حركة هادفة','واجهات حقيقية','بونه · الهند']).flat());

  text($,'#services .eyebrow','أربعة مجالات / رؤية واحدة');
  text($,'.v12-story__meta span','BRAYROAI / مجالات العمل');
  const stories=[
    ['٠١ / تجارب الويب','اجعل الانطباع الأول يستحق الانتباه.','نجمع هيكلة المحتوى والتوجيه الفني والتصميم المتجاوب والحركة الهادفة في موقع يبدو مصمماً بعناية، لا مركباً من أجزاء جاهزة.',['التوجيه','تجربة متجاوبة','الحركة','مسارات الاستفسار']],
    ['٠٢ / تصميم المنتجات','حوّل التعقيد إلى واجهة يفهمها الناس.','نصمم المسارات وحالات التفاعل والنظام البصري انطلاقاً مما ينبغي أن ينجزه المستخدم، لا من زخارف الواجهات المعتادة.',['المسارات','التفاعل','أنظمة التصميم','نماذج أولية']],
    ['٠٣ / هندسة الواجهات','اجعل الفكرة تنجح داخل المتصفح.','نبني واجهات متجاوبة وتفاعلات سهلة الوصول وتفاصيل تنفيذ تصمد بعد انتقال الفكرة من التصميم إلى المنتج الحقيقي.',['تهيئة لـ React','الأداء','سهولة الوصول','إمكانية الوصول']],
    ['٠٤ / أنظمة الذكاء','استخدم الذكاء الاصطناعي حيث يخفف العبء فعلاً.','تدقيقات مركزة وأنظمة معرفة داخلية وأتمتة عملية تبدأ من طريقة عمل الشركة، لا من أداة جديدة تبحث عن مشكلة.',['تدقيق سير العمل','ذاكرة الشركة','أنظمة المعرفة','الأتمتة']]
  ];
  $('.v12-story-step').each((index,element)=>{
    const [eyebrow,title,body,features]=stories[index]||[];if(!title)return;
    const card=$(element);card.find('small').first().text(eyebrow);card.find('h3').text(title);card.find('p').text(body);
    card.find('li').each((i,item)=>{if(features[i])$(item).text(features[i])});
  });
  text($,'.capability-browser__hero small','صُممت لتترك أثراً');
  html($,'.capability-browser__hero b','اجعل<br>اللحظة <em>مهمة.</em>');
  text($,'.capability-browser__hero>span','٠١ / التوجيه');
  text($,'.capability-art--web .capability-art__stamp','موقع له وجهة نظر ↗');
  $('.capability-flow__node').each((i,element)=>{
    const copy=[['٠١ / الحاجة','افهم المشكلة','ما الأهم أولاً؟'],['٠٢ / المسار','شكّل الطريق','إلى أين يقود؟'],['٠٣ / الفعل','وضح الخطوة','ماذا يحدث بعدها؟']][i];
    if(!copy)return;const node=$(element);node.find('small').text(copy[0]);node.find('strong').text(copy[1]);node.find('span').text(copy[2]);
  });
  text($,'.capability-art--product .capability-art__stamp','من التعقيد إلى الوضوح ↗');
  text($,'.capability-code__result span','اكتمل البناء');
  text($,'.capability-code__result strong','سريع · متجاوب · حقيقي');
  text($,'.capability-art--frontend .capability-art__stamp','الفكرة تنجح داخل المتصفح ↗');
  html($,'.capability-ai__sources>span','مصادر<br>معتمدة');
  text($,'.capability-ai__answer small','ذكاء مفيد / مستند إلى مصادر');
  html($,'.capability-ai__answer strong','إجابات<br>لها <em>سياق.</em>');
  text($,'.capability-ai__answer>span','يبقى القرار البشري جزءاً من المسار.');
  text($,'.capability-art--ai .capability-art__stamp','عمل أقل · قرارات أوضح ↗');
  text($,'[data-v12-story-word]','الويب');

  text($,'.editorial-sequence__topline span','BRAYROAI / من الفكرة إلى المتصفح');
  $('.editorial-sequence__copy').each((i,element)=>{
    const copy=[['٠١ / التوجيه','نحدد وجهة النظر قبل تقرير شكل الصفحة.'],['٠٢ / الهندسة','نحوّل التوجيه إلى نظام حقيقي يعمل مع التفاعل والسرعة وعلى كل شاشة.'],['٠٣ / التسليم','نصقل التجربة في المتصفح حتى تبدو الفكرة مكتملة، لا منتهية فحسب.']][i];
    if(copy){$(element).find('small').text(copy[0]);$(element).find('p').text(copy[1])}
  });
  text($,'[data-editorial-status]','التوجيه / اكتشف وجهة النظر');
  text($,'.editorial-sequence__join small','٠٤ / الفكرة');
  html($,'.editorial-sequence__join strong','استوديو واحد.<br>بلا <span>تسليم متقطع.</span>');
  text($,'.editorial-sequence__join p','تبقى الاستراتيجية والواجهة والتنفيذ مترابطة من القرار الأول حتى الإطلاق.');
  list($,'.editorial-sequence__footer span',['التصميم ← الهندسة ← التسليم','مرّر لتتبع مسار العمل']);

  text($,'#work .eyebrow','أعمال مختارة / أنظمة تتحرك');
  text($,'.v12-work-head>p','يبقى عمل العملاء الحقيقي في المقدمة. وتُعرض دراسات الاستوديو بوضوح حتى لا تختلط التجارب الداخلية بأدلة العمل مع العملاء.');
  $('.v12-project-row').each((i,element)=>{
    const copy=['موقع لكتالوج الخيوط / تجربة استفسار متجاوبة','توجيه فني تحريري / تفاعل سينمائي / حركة تراعي الأداء','التوجيه ← الهندسة ← ذكاء مفيد / نظام إنتاج متصل'][i];
    if(copy)$(element).find('p').text(copy);
  });
  text($,'.v12-project-row:nth-child(2) h3','BRAYROAI / الموقع');
  text($,'.v12-project-row:nth-child(3) h3','BRAYROAI / المنهج');
  text($,'[data-client-archive-link]','استكشف جميع أعمال العملاء ←');
  text($,'.v12-featured-case .eyebrow','عميل مميز / FakhriMart');
  text($,'.v12-featured-case h2','موقع عميل حقيقي، صُمم لتصفح واضح واستفسار مباشر.');
  text($,'.v12-featured-case .section-heading>p:not(.eyebrow)','موقع كتالوج منشور يساعد الزائر على تصفح المنتجات بوضوح وإرسال استفسار مباشر من الهاتف أو الحاسوب.');
  text($,'[data-fakhri-case-link]','اقرأ دراسة الحالة ←');
  firstText($,'.v12-featured-case .text-link[href^="https"]','شاهد الموقع المباشر ');
  text($,'.work__toggle span','غيّر زاوية العرض');
  $('.work__desktop img').attr('alt','واجهة موقع FakhriMart على الحاسوب');
  $('.work__mobile img').attr('alt','واجهة موقع FakhriMart على الهاتف');

  text($,'#ai-systems .eyebrow','أنظمة ذكاء للشركات النامية');
  text($,'.v12-ai-head>p','طريقتان واضحتان للبدء: اكتشف أولاً أين يفيد الذكاء الاصطناعي العمل، ثم حوّل معرفة الشركة المعتمدة إلى إجابات يستطيع الفريق استخدامها.');
  const aiCards=[
    {top:'٠١ / ابدأ بالوضوح',pill:'نطاق ثابت',price:'تدقيق مركز / مرة واحدة',body:'اعرف أين يمكن للذكاء الاصطناعي أن يخفف العمل فعلاً قبل شراء أدوات أو بناء أنظمة لا تحتاج إليها.',features:['جلسة اكتشاف لمدة ٦٠ إلى ٩٠ دقيقة','مراجعة سير العمل والأدوات والعوائق','٣ إلى ٥ فرص واقعية للذكاء الاصطناعي','أولويات: نفذ الآن / اختبر لاحقاً / تجنب','خطة عمل واضحة ومراجعة لمدة ٣٠ دقيقة'],note:`تُحتسب رسوم التدقيق البالغة ${priceFor('ai-workflow-audit','ae-ar')} ضمن نظام ذكاء اصطناعي تنفذه BRAYROAI لاحقاً.`,cta:'احجز التدقيق '},
    {top:'٠٢ / اجعل المعرفة مفيدة',pill:'صُمم لفريقك',price:'تنفيذ حسب النطاق',body:'معرفة شركتك المعتمدة، منظمة وقابلة للبحث والاستخدام عبر مساعد داخلي.',features:['مساحة معرفة مركزية واحدة','حتى نحو ٥٠ مستنداً معتمداً أو حجم متفق عليه','تنظيم المستندات وهيكلة المعرفة','مساعد داخلي يعتمد على المعلومات المعتمدة','حتى ١٠ أعضاء من الفريق وإعداد أساسي للأدوار','مكالمة تهيئة و١٤ يوماً من دعم الإطلاق'],note:'تُحدد الأقسام الإضافية وتكاملات Drive وCRM وواتساب والصلاحيات أو المساعدون المتعددون ضمن نطاق موسع.',cta:'خطط للنظام '}
  ];
  $('.v12-product-card').each((i,element)=>{
    const copy=aiCards[i];if(!copy)return;const card=$(element);
    card.find('.v12-product-card__top>span').first().text(copy.top);card.find('.v12-product-card__pill').text(copy.pill);
    card.find('.v12-product-card__price small').text(copy.price);card.children('p').first().text(copy.body);
    card.find('li').each((j,item)=>{if(copy.features[j])$(item).text(copy.features[j])});
    card.find('.v12-credit-note').text(copy.note);firstText($,card.find('.v12-product-card__cta'),copy.cta);
  });
  firstText($,'.v12-product-card--brain .v12-product-card__price',`ابتداءً من ${priceFor('company-second-brain','ae-ar')}`);
  $('.v12-ai-journey>div').each((i,element)=>{
    const copy=[['الخطوة ٠١','تدقيق سير العمل'],['الخطوة ٠٢','حدد الفرصة الأعلى قيمة'],['الخطوة ٠٣','ذاكرة الشركة أو تنفيذ سير العمل']][i];
    if(copy){$(element).find('small').text(copy[0]);$(element).find('strong').text(copy[1])}
  });
  const signal=['خطوات أولى بسيطة','نطاق واضح','بلا ضغط لشراء أدوات','مصادر شركة معتمدة','يبقى القرار للبشر',`رعاية المعرفة ابتداءً من ${priceFor('knowledge-care','ae-ar')}`];
  list($,'.v12-signal-strip:last-of-type .v12-signal-track span',[...signal,...signal]);

  text($,'#plans .eyebrow','ثلاث طرق للعمل معاً');
  html($,'#plans .section-heading h2','تطوير شهري.<br>مشروع متكامل.<br>أو <em>نظام ذكاء مفيد.</em>');
  text($,'#plans .section-heading>p:not(.eyebrow)','تظل شراكات المواقع ومشاريع البناء منفصلة عن أنظمة الذكاء. نطاق واضح وأسعار منشورة من البداية.');
  const groups=[
    {eyebrow:'٠١ / شهرياً',title:'شراكة مستمرة للموقع',body:'لتحديث الموقع وتحسينه باستمرار بعد الإطلاق أو عندما يكون لديك موقع قائم.',badge:'تُحاسب شهرياً',cards:[['الخطة الشهرية الأساسية','تحديثات دورية وصيانة للموقع.'],['الخطة الشهرية للنمو','تحسينات أكثر نشاطاً للأقسام ومسارات الاستفسار.'],['الخطة الشهرية المتقدمة','تصميم وحركة وتطوير بأولوية مستمرة.']]},
    {eyebrow:'٠٢ / مشروع واحد',title:'بناء موقع متكامل',body:'لمشروع محدد يبدأ بالتوجيه والتصميم ويمر بالتطوير وينتهي بالإطلاق.',badge:'تُحاسب كمشروع',cards:[['موقع الإطلاق','موقع متكامل ومركز لبداية قوية.'],['تجربة الأعمال','موقع أعمال أعمق بسرد وحركة أقوى.'],['التجربة المميزة','توجيه فني وتجربة سينمائية مخصصة.']]}
  ];
  $('#plans .pricing-band').each((i,element)=>{
    const copy=groups[i];if(!copy)return;const band=$(element);
    band.attr('aria-label',copy.title);band.find('.pricing-band__head small').text(copy.eyebrow);
    band.find('.pricing-band__head h3').text(copy.title);band.find('.pricing-band__head p').text(copy.body);
    band.find('.pricing-band__badge').text(copy.badge);
    band.find('.pricing-mini').each((j,item)=>{const card=copy.cards[j];if(card){$(item).find('small').text(card[0]);$(item).find('p').text(card[1])}});
  });
  const aiRail=['تدقيق سير العمل','ذاكرة الشركة الذكية','رعاية المعرفة'];
  text($,'.v12-ai-price-rail>div>small','٠٣ / ذكاء عملي');
  text($,'.v12-ai-price-rail>div>strong','أنظمة ذكاء للشركات النامية');
  text($,'.v12-ai-price-rail>div>p','ابدأ بالوضوح، ثم ابنِ النظام الذي يحل مشكلة تشغيلية حقيقية.');
  $('.v12-ai-price-rail>a').each((i,element)=>{const node=$(element);node.find('small').text(aiRail[i]||'');node.find('b').text(['نطاق ثابت ←','ابتداءً من ←','شراكة مستمرة ←'][i]||'')});
  text($,'.care-note small','الأسعار واضحة');
  text($,'.care-note p','العمل الشهري وبناء الموقع وأنظمة الذكاء مجالات منفصلة. النطاق والاستضافة وواجهات البرمجة وتكاليف الأطراف الأخرى منفصلة ما لم تُذكر كتابةً.');
  firstText($,'.plans-preview__link','قارن جميع الخدمات ');

  text($,'.founder-preview figcaption','ياش غانيش / المؤسس');
  text($,'.founder-preview .eyebrow','يبقى العمل قريباً من الفكرة');
  text($,'.founder-preview h2','رؤية واحدة تهتم بالتجربة كلها.');
  text($,'.founder-preview .section-heading>p:not(.eyebrow)','يقود ياش الاستراتيجية والواجهة والتنفيذ، فيبقى العميل قريباً من الشخص الذي يتخذ القرارات طوال المشروع.');
  firstText($,'.founder-preview .text-link','تعرّف إلى المؤسس ');
  text($,'#contact .eyebrow','خطوتك التالية');
  text($,'#contact .close__intro','ينبغي أن تجعل المحادثة الأولى العمل أوضح. أخبرنا بما تريد تغييره حتى لو كانت الفكرة في بدايتها.');
  firstText($,'#contact .close__action','ابدأ عبر واتساب ');
  firstText($,'#contact .close__email','أو راسل ياش ');
  html($,'.site-footer__invitation h2','لديك فكرة<br><em>تستحق البناء؟</em>');
  text($,'.site-footer__eyebrow','BRAYROAI / بونه · الهند');
  text($,'.site-footer__invitation p','ابدأ بالمشكلة. يقود ياش التوجيه والواجهة والتنفيذ من المحادثة الأولى حتى الإطلاق.');
  firstText($,'.site-footer__cta','ابدأ محادثة ');
  list($,'.site-footer__directory h3',['استكشف','تفاصيل أكثر','تواصل مباشرة']);
  const footer={'Selected work':'أعمال مختارة','Pricing preview':'لمحة عن الأسعار','Client archive':'أعمال العملاء','All plans':'جميع الخطط','Meet the founder':'تعرّف إلى المؤسس','Email Yash':'راسل ياش','WhatsApp':'واتساب','Ask Rae':'اسأل راي','BACK TO TOP':'العودة إلى الأعلى'};
  $('.site-footer__directory a,.site-footer__directory button').each((_,element)=>{
    const node=$(element);const label=node.contents().filter((_,part)=>part.type==='text').first();const translated=footer[label.text().trim()];if(translated)label.replaceWith(translated+' ');
  });
  html($,'.site-footer__location','نعمل مع فرق طموحة<br>من بونه، الهند.');
  list($,'.site-footer__base span',['© ٢٠٢٦ BRAYROAI · تصميم · هندسة · ذكاء مفيد','صُمم ليُستخدم، لا ليُشاهد فقط.']);
  firstText($,'.site-footer__base>a','العودة إلى الأعلى ');
  $('.hero__subject').first().attr('alt','ياش غانيش، مؤسس BRAYROAI');
  $('.founder-preview img').attr('alt','ياش غانيش، مؤسس BRAYROAI');
}
