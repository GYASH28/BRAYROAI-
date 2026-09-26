import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {load} from 'cheerio';
import {MARKETS,MARKET_ROUTES,marketRoute} from '../data/markets.js';
import {OFFERS,priceFor,leadText} from '../data/pricing.js';
import {translateArabicService} from './arabic-services.mjs';
import {translateArabicHome} from './arabic-home.mjs';
import {translateArabicFounder,translateArabicClientArchive,translateArabicCaseIntro,translateArabicTerms} from './arabic-inner.mjs';

const origin='https://brayroai.vercel.app';
const source={
  '/':'index.html','/plans':'plans.html','/clients':'clients.html','/clients/fakhrimart':'fakhrimart-case-study.html',
  '/ai-workflow-audit':'ai-workflow-audit.html','/company-second-brain':'company-second-brain.html','/founder':'founder.html','/terms':'terms.html'
};
const markets=['ae','ae-ar','au'];
const title={
  ae:'BRAYROAI · Creative technology for UAE businesses',
  'ae-ar':'BRAYROAI · تجارب رقمية وأنظمة ذكاء اصطناعي للإمارات',
  au:'BRAYROAI · Creative technology for Australian businesses'
};
const descriptions={
  ae:'BRAYROAI is a founder-led remote studio serving UAE businesses with distinctive websites, product design and practical AI systems. Explore clear AED starting prices.',
  'ae-ar':'BRAYROAI استوديو إبداعي تقني يعمل عن بُعد مع الشركات في الإمارات. نصمم مواقع وتجارب رقمية وأنظمة ذكاء اصطناعي عملية بأسعار واضحة بالدرهم.',
  au:'BRAYROAI is a founder-led remote studio serving Australian businesses with distinctive websites, product design and practical AI systems. Explore clear A$ starting prices.'
};
const marketRuntime=market=>{
  const {prefix,locale,currency}=MARKETS[market];
  const prices=Object.fromEntries(Object.keys(OFFERS).map(id=>[id,priceFor(id,market)]));
  return `(()=>{const prefix=${JSON.stringify(prefix)},prices=${JSON.stringify(prices)};const route=location.pathname.slice(prefix.length)||'/';window.BRAYRO_MARKET=Object.freeze({id:${JSON.stringify(market)},locale:${JSON.stringify(locale)},currency:${JSON.stringify(currency)},route,prices,price:key=>prices[key],link:(target,hash='')=>prefix+(target==='/'?'/':target)+(hash||'')});})();`;
};
const compactPrice=(id,market)=>priceFor(id,market).replace(/\/(?:month|mo)$/,'');
const offerIdFor=($,node,route)=>{
  const parent=$(node.parent);
  const plan=parent.closest('[data-offer-id]').attr('data-offer-id');if(plan&&OFFERS[plan])return plan;
  if(parent.closest('.v12-product-card--audit').length)return'ai-workflow-audit';
  if(parent.closest('.v12-product-card--brain').length)return'company-second-brain';
  if(parent.closest('.ai-plan-card').length){const heading=parent.closest('.ai-plan-card').find('h3').text();return/Second Brain/i.test(heading)?'company-second-brain':'ai-workflow-audit'}
  if(parent.closest('.plan-decision__card').length){const href=parent.closest('.plan-decision__card').attr('href');return href==='#ai-systems'?'ai-workflow-audit':href==='#monthly'?'monthly-starter':'launch-website'}
  if(parent.closest('[aria-label="AI system comparison"]').length)return'ai-workflow-audit';
  if(parent.closest('#ai-systems,.v12-ai-price-rail,.ai-care-strip').length)return'ai-workflow-audit';
  if(parent.closest('a[href*="ai-systems"]').length)return'ai-workflow-audit';
  if(route==='/ai-workflow-audit')return'ai-workflow-audit';
  return'launch-website';
};
function replacePrices($,market,route){
  const walk=node=>{
    if(node.type==='script'||node.type==='style')return;
    if(node.type==='text'&&node.data?.includes('₹')){
      const chosen=offerIdFor($,node,route);
      node.data=node.data
        .replace(/₹5,999\+?\/mo/g,priceFor('monthly-studio',market))
        .replace(/₹3,999\/mo/g,priceFor('monthly-growth',market))
        .replace(/₹2,599\/mo/g,priceFor('monthly-starter',market))
        .replace(/₹2,999\+?\/mo/g,priceFor('knowledge-care',market))
        .replace(/₹25K[–-]₹35K\+|₹25,000[–-]₹35,000\+/g,compactPrice('premium-experience',market))
        .replace(/₹29,999\+?/g,compactPrice('company-second-brain',market))
        .replace(/₹17,999/g,compactPrice('business-experience',market))
        .replace(/₹9,999\+?/g,compactPrice(chosen,market))
        .replace(/₹5,999\+?/g,compactPrice('monthly-studio',market))
        .replace(/₹3,999/g,compactPrice('monthly-growth',market))
        .replace(/₹2,999/g,compactPrice('knowledge-care',market))
        .replace(/₹2,599\+?/g,compactPrice('monthly-starter',market));
    }
    for(const child of node.children||[])walk(child);
  };
  for(const node of $.root().get())walk(node);
  $('.pricing-mini strong span').text('/month');
}
const setText=($,selector,text)=>{const node=$(selector).first();if(node.length)node.text(text)};
const setHtml=($,selector,html)=>{const node=$(selector).first();if(node.length)node.html(html)};
function localizeEnglish($,market,route){
  const uae=market==='ae';
  const territory=uae?'the UAE':'Australia';
  const country=uae?'UAE':'Australia';
  $('.market-trigger').contents().filter((_,node)=>node.type==='text').first().replaceWith(`${MARKETS[market].label} `);
  $('.global-menu__market').text(`Change market · ${MARKETS[market].currency}`);
  setText($,'.global-footer__top>div>small',`BRAYROAI / REMOTE STUDIO SERVING ${country.toUpperCase()}`);
  setText($,'.global-footer__top>nav>div:last-child>span',`Based in Pune, India · Serving ${territory} remotely`);
  if(route==='/'){
    setText($,'.hero__copy .eyebrow',`CREATIVE TECHNOLOGY STUDIO / SERVING ${country.toUpperCase()} REMOTELY`);
    setText($,'.hero__body',uae?'Distinctive websites, digital products and useful AI for businesses across the UAE. English and Arabic experiences, mobile enquiry paths and clear delivery scope are available where the project needs them.':'Distinctive websites, digital products and useful AI for Australian businesses. Clear scope, purposeful design and performance-minded engineering from a remote specialist studio.');
    setText($,'#services .v12-capabilities__head>p',uae?'Direction, interface and engineering stay connected. For UAE teams, bilingual content and WhatsApp enquiry paths can be scoped as part of the build.':'Direction, interface and engineering stay connected. Every layout is shaped for clear enquiry, accessibility and real device performance.');
  }
  if(route==='/plans'){
    setText($,'.plans-hero__copy>p:not(.eyebrow)',uae?'Choose ongoing website attention, a complete build or a practical AI system. Prices are in AED; Arabic/English site scope can be planned separately when needed.':'Choose ongoing website attention, a complete build or a practical AI system. Prices are in A$, with written scope and clear deliverables before work begins.');
    setText($,'.care__heading>p',`Applicable taxes, domain, hosting, APIs and paid third-party services are separate unless included in writing. Proposals for ${territory} are agreed in the displayed currency where supported.`);
  }
  if(route==='/founder')setText($,'.founder-close__note',`Yash works remotely from Pune with businesses in ${territory}. Your project brief opens with the details needed for a useful first conversation.`);
  if(route==='/clients')setText($,'.client-hero__lead>p',`Verified work stays factual. This Pune client case shows the decisions and interface BRAYROAI can bring to a remote project in ${territory}.`);
  if(route==='/terms'){$('.terms-hero__copy').append(`<p class="market-legal-note">For enquiries from ${territory}, published prices use ${uae?'AED':'A$'}. Applicable taxes and third-party charges are separate unless the written proposal says otherwise. BRAYROAI remains based in Pune, India.</p>`)}
  if(market==='au'){
    const walk=node=>{if(node.type==='text'&&node.data){node.data=node.data.replace(/\boptimize\b/gi,'optimise').replace(/\borganization\b/gi,'organisation').replace(/\bpersonalized\b/gi,'personalised').replace(/\binquiry\b/gi,'enquiry')}for(const child of node.children||[])if(child.type!=='script'&&child.type!=='style')walk(child)};
    for(const node of $.root().get())walk(node);
  }
}
const arabicRouteCopy={
  '/':{heading:'.v12-hero-title',html:'<span>تجارب رقمية</span><span>تترك <em>أثراً مختلفاً.</em></span>',lead:'.hero__body',leadText:'نصمم مواقع ومنتجات رقمية وأنظمة ذكاء اصطناعي عملية للشركات في الإمارات. رؤية واضحة، تصميم مؤثر، وتنفيذ متقن من الفكرة إلى الإطلاق.'},
  '/plans':{heading:'.plans-hero__copy h1',html:'<span>اختر طريقة العمل.</span><span>واحتفظ <em>بالطموح.</em></span>',lead:'.plans-hero__copy>p:not(.eyebrow)',leadText:'اختر شراكة شهرية لتطوير موقعك، أو مشروعاً متكاملاً للإطلاق، أو نظام ذكاء اصطناعي يحل مشكلة فعلية. الأسعار بالدرهم الإماراتي.'},
  '/founder':{heading:'.founder-hero h1',html:'<span>يبقى العمل قريباً</span><span>من <em>الفكرة.</em></span>',lead:'.founder-hero__copy>p:last-of-type',leadText:'يقود ياش غانيش الاستراتيجية والتصميم والتنفيذ بنفسه، ليبقى القرار واضحاً من البداية إلى الإطلاق.'},
  '/clients':{heading:'.client-hero h1',html:'أعمال العملاء،<br><em>بوضوح.</em>',lead:'.client-hero__lead>p',leadText:'نعرض أعمال العملاء الموثقة بوضوح، مع فصلها عن تجارب الاستوديو. مشروع FakhriMart هو المثال المنشور حالياً.'},
  '/clients/fakhrimart':{heading:'.case-hero h1',html:'FakhriMart<br><em>دراسة حالة موثقة.</em>',lead:'.case-hero__lead>p',leadText:'تجربة تصفح واستفسار لمورّد خيوط وأدوات حرفية في بونه، الهند. شاهد القرارات والواجهة والموقع المباشر دون ادعاءات عن نتائج غير مثبتة.'},
  '/ai-workflow-audit':{heading:'.ai-hero h1',html:'اكتشف أين يساعد الذكاء الاصطناعي <em>حقاً.</em>',lead:'.ai-hero__bottom p',leadText:'تدقيق مركز لسير عمل واحد، يحدد فرصاً عملية ويضع أولويات واضحة قبل الاستثمار في أدوات أو أنظمة أكبر.'},
  '/company-second-brain':{heading:'.ai-hero h1',html:'حوّل المعرفة المعتمدة إلى <em>إجابات مفيدة.</em>',lead:'.ai-hero__bottom p',leadText:'نظام معرفة داخلي يعتمد على مصادر الشركة المعتمدة ويُظهر السياق المناسب. يُحدد النطاق والوصول والتكاملات في عرض مكتوب.'},
  '/terms':{heading:'.terms-hero h1',html:'شروط واضحة.<br><em>عمل أفضل.</em>',lead:'.terms-hero__copy>p:not(.eyebrow)',leadText:'توضح هذه الشروط قواعد العمل الأساسية للمشاريع والشراكات الشهرية. يمكن للعرض المكتوب أو الفاتورة تحديد شروط إضافية للمشروع.'}
};
const arabicLabels={
  'Monthly':'شهري','Builds':'المشاريع','Compare':'قارن','Care':'التفاصيل','Overview':'نظرة عامة','Process':'العملية','Outcome':'النتيجة','Work':'الأعمال','AI systems':'أنظمة الذكاء','AI Systems':'أنظمة الذكاء','Start':'البداية','Capabilities':'الخدمات','Contact':'تواصل','Choose':'الاختيار','One-time':'مشروع واحد','PLANS':'الخطط','INDEX':'الفهرس','Principles':'المبادئ','Approach':'المنهج','Experience':'التجربة','FOUNDER':'المؤسس','CLIENTS':'العملاء','TERMS':'الشروط','Story':'القصة','Method':'المنهج','Index':'الفهرس','Services':'الخدمات','Pricing':'الأسعار','Payments':'الدفعات','Ownership':'الملكية','Liability':'المسؤولية','Plans':'الخطط','What we fix':'ما نقدمه',
  'CLEAR SCOPE / ONE STANDARD':'نطاق واضح / معيار واحد','Monthly partnership':'شراكة شهرية','One-time build':'مشروع متكامل','Looking for AI systems? See the AI offers':'تبحث عن نظام ذكاء اصطناعي؟ اكتشف الخيارات','THE CURRENT FIT':'الخيار الحالي','ONE-TIME / COMPLETE BUILD':'مشروع متكامل','See the plans':'شاهد الخطط','THREE WAYS TO WORK TOGETHER':'ثلاث طرق للعمل معاً','01 / KEEP IMPROVING':'٠١ / تطوير مستمر','02 / BUILD + LAUNCH':'٠٢ / بناء وإطلاق','03 / REMOVE FRICTION':'٠٣ / تبسيط العمل','Compare all published offers':'قارن جميع الخيارات المنشورة',
  'ONGOING / MONTHLY':'شراكة مستمرة / شهرياً','ONE-TIME FAMILY / 02':'مشاريع متكاملة / ٠٢','MONTHLY FAMILY / 01':'شراكات شهرية / ٠١','Website care + growth':'تطوير الموقع ونموه','Complete website builds':'بناء مواقع متكاملة','PRACTICAL AI / GROWING COMPANIES':'ذكاء اصطناعي عملي / للشركات النامية','FIXED SCOPE':'نطاق ثابت','IMPLEMENTATION':'تنفيذ','ONGOING / OPTIONAL':'دعم مستمر / اختياري','CHOOSE THE RIGHT JOB':'اختر ما يحقق هدفك','CLEAR BOUNDARIES / NO SURPRISES':'نطاق واضح / بلا مفاجآت','BRING THE ROUGH BRIEF':'ابدأ بفكرة أولية',
  'Monthly Starter':'الخطة الشهرية الأساسية','Monthly Growth':'الخطة الشهرية للنمو','Monthly Studio':'الخطة الشهرية المتقدمة','Launch Website':'موقع الإطلاق','Business Experience':'تجربة الأعمال','Premium Experience':'التجربة المميزة','AI Workflow Audit':'تدقيق سير العمل بالذكاء الاصطناعي','Company Second Brain':'ذاكرة الشركة الذكية','Knowledge Care':'رعاية المعرفة',
  'PER MONTH / ONGOING':'شهرياً / مستمر','PER MONTH / CUSTOM ONGOING':'شهرياً / حسب النطاق','STARTING / ONE-TIME BUILD':'ابتداءً من / مشروع واحد','CUSTOM / ONE-TIME BUILD':'حسب النطاق / مشروع واحد','ESSENTIAL MONTHLY':'أساسيات شهرية','MOST PRACTICAL':'الأكثر ملاءمة','PRIORITY MONTHLY':'أولوية شهرية','FOCUSED BUILD':'بناء مركز','CORE BUSINESS BUILD':'موقع أعمال متكامل','PREMIUM / CINEMATIC':'تجربة مميزة',
  'Start Monthly Starter':'ابدأ بالخطة الأساسية','Start Monthly Growth':'ابدأ بخطة النمو','Scope Monthly Studio':'حدد نطاق الخطة المتقدمة','Build my Launch website':'ابنِ موقع الإطلاق','Build my Business experience':'ابنِ تجربة الأعمال','Scope my Premium experience':'حدد نطاق التجربة المميزة','Book the audit':'احجز التدقيق','Plan the system':'خطط للنظام','Help me choose an offer':'ساعدني على اختيار الخدمة',
  'Decision':'القرار','Recurring price':'السعر الشهري','One-time price':'سعر المشروع','Starting price':'السعر الابتدائي','Best for':'الأنسب لـ','Upkeep':'الصيانة','Continuous growth':'نمو مستمر','Priority iteration':'تطوير بأولوية','Focused launch':'إطلاق مركز','Full business presence':'حضور أعمال متكامل','Bespoke experience':'تجربة مصممة خصيصاً','Finding where to start':'تحديد نقطة البداية','Making knowledge usable':'جعل المعرفة مفيدة','Keeping it current':'تحديثها باستمرار','Swipe sideways to compare every column.':'مرر جانبياً للمقارنة بين الخيارات.',
  'Domain + hosting':'النطاق والاستضافة','APIs + licenses':'واجهات البرمجة والتراخيص','Knowledge boundaries':'حدود المعرفة','Terms & Conditions':'الشروط والأحكام','We will make the right scope clear.':'سنحدد النطاق المناسب بوضوح.','Agency site':'الصفحة الرئيسية',
  'No invented outcome metrics':'لا ندّعي نتائج غير موثقة','Search client work':'ابحث في أعمال العملاء','All work':'كل الأعمال','Live work':'الأعمال المنشورة',
  'How it works':'كيف نعمل','Deliverables':'المخرجات','Fit':'الملاءمة','Architecture':'البنية','Integration':'التكامل','Scope':'النطاق','FAQ':'الأسئلة',
  'EXPLORE':'استكشف','WORK TOGETHER':'نعمل معاً','ELSEWHERE':'روابط أخرى','Back to top':'العودة للأعلى','Built for useful impact.':'صُممت لأثر حقيقي.',
  'COMPLETE PROJECT / ONE-TIME':'مشروع متكامل / لمرة واحدة','Workflow Audit':'تدقيق سير العمل','Second Brain':'ذاكرة الشركة الذكية','Business':'الأعمال','Launch':'الإطلاق','Premium':'المميزة','BRAYROAI / PLANS':'BRAYROAI / الخطط'
};
function translateArabicLabels($){
  const walk=node=>{
    if(node.type==='script'||node.type==='style')return;
    if(node.type==='text'&&node.data){const match=node.data.match(/^(\s*)(.*?)(\s*)$/s);if(match&&arabicLabels[match[2]])node.data=match[1]+arabicLabels[match[2]]+match[3]}
    for(const child of node.children||[])walk(child);
  };
  for(const node of $.root().get())walk(node);
}
const arabicPlans={
  'monthly-starter':{description:'دعم مستمر وخفيف للموقع، مناسب للشركات التي تحتاج إلى تحديثات منتظمة دون عبء عمل كبير.',features:['تحديثات المحتوى والنصوص المعتادة','تحسينات صغيرة للتخطيط والأقسام','إصلاحات التوافق مع الهواتف وصيانة أساسية','قائمة أولويات شهرية متفق عليها'],boundary:'الصفحات الجديدة الكاملة وإعادة التصميم الكبيرة والمتاجر والتطبيقات المخصصة لها عروض مستقلة.'},
  'monthly-business':{description:'تعاون مستمر للشركات التي تطور طريقة عرض موقعها وشرح خدماتها وتحويل الزيارات إلى استفسارات.',features:['تحديثات أكثر تكراراً للموقع','تحسين الأقسام وصفحات الهبوط','تحسين مسارات الاستفسار والدعوات لاتخاذ إجراء','صقل التصميم والحركة باستمرار'],boundary:'الميزات الكبيرة والهوية الجديدة والتكاملات المتقدمة تُحدد ضمن مشروع مستقل.'},
  'monthly-premium':{description:'تعاون متقدم للمواقع التي تحتاج إلى تطوير أعمق أو حركة أغنى أو حجم عمل شهري أكبر.',features:['قائمة تحسينات للموقع بأولوية','تطوير أغنى للواجهة والحركة','تجارب الحملات وصفحات الهبوط','نطاق شهري مخصص حسب احتياجاتك'],boundary:'علامة + تعكس اختلاف حجم العمل. نتفق على النطاق الشهري قبل بدء التعاون.'},
  starter:{description:'موقع متكامل ومركز لشركة تحتاج إلى إطلاق موثوق ومدروس، مع تجربة مصممة لهدف واضح.',features:['موقع متجاوب ومتكامل','هيكلة المحتوى والاتجاه البصري','تفاعلات مدروسة وصقل للتفاصيل','أساسيات الظهور في البحث ومسار الاستفسار والإطلاق'],boundary:'الكتالوجات الكبيرة والمتاجر الإلكترونية ومنطق التطبيقات المتقدم وإدخال المحتوى الواسع لها نطاق مستقل.'},
  business:{description:'تجربة أعمال أكثر اكتمالاً بسرد أقوى ومسارات متعددة وتصميم أعمق.',features:['موقع متكامل بأقسام أو صفحات متعددة','اتجاه فني مخصص وتسلسل بصري أوضح','حركة وتفاعلات متقدمة تخدم الاستخدام','مسارات استفسار مصممة للتحويل'],boundary:'المنصات المعقدة والمتاجر والحسابات والذكاء الاصطناعي المتقدم تُحدد بشكل منفصل عند الحاجة.'},
  custom:{description:'موقع مخصص للعلامات التي تريد سرداً بصرياً سينمائياً وتفاعلاً أعمق وتجربة رقمية ذات طابع خاص.',features:['نظام موقع بتوجيه فني متقدم','حركة وانتقالات مدروسة مع التمرير','تخطيطات وحالات وتفاعلات مخصصة أكثر','صقل عميق للهواتف والأجهزة المختلفة قبل الإطلاق'],boundary:'يتحدد السعر النهائي وفق التعقيد وعدد الصفحات والأنظمة المخصصة والمحتوى والتكاملات.'}
};
function translateArabicPlans($){
  // Keep the first paint in Arabic too; the mode director updates this panel
  // again after its script loads.
  setText($,'[data-plan-mode-output] section h2','تجربة الأعمال');
  setText($,'[data-plan-mode-output] section>p','موقع أعمال متكامل يشمل التخطيط والتصميم والتطوير والتوافق مع الأجهزة والإطلاق ضمن نطاق واضح.');
  $('.plan-decision__card').each((i,el)=>{
    const summaries=[`ابتداءً من ${priceFor('monthly-starter','ae-ar')} شهرياً`,`ابتداءً من ${priceFor('launch-website','ae-ar')} للمشروع`,`التدقيق ${priceFor('ai-workflow-audit','ae-ar')} · الأنظمة ابتداءً من ${priceFor('company-second-brain','ae-ar')}`];
    $(el).find('small').text(summaries[i]||'');
  });
  const planNames={'monthly-starter':'الخطة الشهرية<br>الأساسية','monthly-business':'الخطة الشهرية<br>للنمو','monthly-premium':'الخطة الشهرية<br>المتقدمة',starter:'موقع<br>الإطلاق',business:'تجربة<br>الأعمال',custom:'التجربة<br>المميزة'};
  $('[data-plan-key]').each((_,element)=>{const name=planNames[$(element).attr('data-plan-key')];if(name)$(element).find('h3').first().html(name)});
  $('.ai-plan-card[data-offer-id="company-second-brain"]>strong').text(`ابتداءً من ${priceFor('company-second-brain','ae-ar')}`);
  $('.ai-care-strip>b').text(`ابتداءً من ${priceFor('knowledge-care','ae-ar')}`);
  setText($,'.plan-family__heading p','للشركات التي لديها موقع قائم وتحتاج إلى تطوير مستمر للتصميم والمحتوى ومسارات الاستفسار بعد الإطلاق.');
  $('#builds .plan-family__heading p').text('لمشروع محدد يشمل التخطيط والتصميم والتطوير والتحسين للأجهزة المختلفة ثم الإطلاق.');
  setHtml($,'#compare .plan-heading h2','نتائج مختلفة.<br><em>والتزام يناسبها.</em>');
  setHtml($,'.care__heading h2','اعرف ما يشمله العرض.<br><em>وما يُسعّر منفصلاً.</em>');
  setHtml($,'.care__note','قد يختلف نطاق المشروع أو جدوله أو طريقة الدفع وفق العرض المكتوب. اقرأ <a class="terms-link" href="/terms">الشروط والأحكام ↗</a> قبل بدء التعاون.');
  $('[role="table"][aria-label="Monthly website partnership comparison"]').attr('aria-label','مقارنة خطط تطوير المواقع الشهرية');
  $('[role="table"][aria-label="One-time website build comparison"]').attr('aria-label','مقارنة مشاريع بناء المواقع');
  $('[role="table"][aria-label="AI system comparison"]').attr('aria-label','مقارنة أنظمة الذكاء الاصطناعي');
  $('.care-grid article>small').each((i,el)=>$(el).text(['٠١ / البنية الأساسية','٠٢ / استخدام الذكاء الاصطناعي','٠٣ / مصادر معتمدة'][i]||''));
  $('[data-plan-key]').each((_,element)=>{
    const copy=arabicPlans[$(element).attr('data-plan-key')];if(!copy)return;
    const section=$(element).children('section');section.children('p').first().text(copy.description);section.children('ul').children('li').each((i,li)=>{if(copy.features[i])$(li).text(copy.features[i])});section.children('.boundary').text(copy.boundary);
  });
  setText($,'.plans-hero__copy .text-link','تبحث عن نظام ذكاء اصطناعي؟ اكتشف الخيارات ↘');
  setHtml($,'.plan-decision__note','هذه أسعار ابتدائية. نتفق على النطاق والجدول الزمني كتابةً قبل بدء العمل. <a href="#compare">قارن جميع الخيارات ↗</a>');
  $('#monthly .plan-heading>p:last-child').text('الخطط الشهرية شراكات مستمرة لتحسين الموقع، وليست أسعاراً لبناء موقع كامل. يُتفق على حجم العمل قبل بدء كل شهر.');
  $('#builds .plan-heading>p:last-child').text('هذه خطط لبناء موقع متكامل في مشروع محدد، وهي مستقلة عن الصيانة أو التحسينات الشهرية.');
  $('#ai-systems .plan-heading>p:last-child').text('نبدأ بتدقيق يحدد فرصة عملية، أو نبني نظام معرفة داخلياً يعتمد على المعلومات التي تعتمدها شركتك.');
  $('#compare .plan-heading>p:last-child').text('اختر العمل الشهري لتحسين الموقع باستمرار، أو المشروع المتكامل لبناء موقع جديد، أو نظام الذكاء الاصطناعي لتحسين تدفق العمل والمعرفة داخل الشركة.');
  $('.ai-plan-card').each((i,el)=>{
    const card=$(el);const copy=i===0?{desc:'اعرف أين يمكن للذكاء الاصطناعي أن يخفف العمل فعلاً، قبل شراء أدوات أو بناء أنظمة.',features:['مكالمة اكتشاف لمدة ٦٠ إلى ٩٠ دقيقة','مراجعة سير العمل والأدوات والعوائق الرئيسية','٣ إلى ٥ فرص واقعية للذكاء الاصطناعي','أولويات: نفذ الآن / اختبر لاحقاً / تجنب','خطة عمل مختصرة بهوية BRAYROAI','مكالمة متابعة لمدة ٣٠ دقيقة'],note:'تُحتسب تكلفة التدقيق ضمن نظام ذكاء اصطناعي تبنيه BRAYROAI لاحقاً. يمكن تحديد نطاق تدقيق أوسع بشكل منفصل.'}:{desc:'معرفة شركتك المعتمدة، منظمة وقابلة للبحث ومتاحة عبر مساعد داخلي.',features:['مساحة معرفة مركزية واحدة','حتى نحو ٥٠ مستنداً معتمداً أو حجم محتوى متفق عليه','تنظيم أساسي للمستندات وتصنيفها','مساعد داخلي يعتمد على معلومات الشركة المعتمدة','حتى ١٠ أعضاء من الفريق','إعداد الأدوار الأساسي ومكالمة تعريفية','١٤ يوماً من الدعم بعد الإطلاق'],note:'تُسعّر المستندات والصلاحيات والتكاملات والمساعدون المتعددون ومسارات العمل المخصصة بشكل منفصل.'};
    card.children('p').first().text(copy.desc);card.children('ul').children('li').each((j,li)=>{if(copy.features[j])$(li).text(copy.features[j])});card.find('.ai-plan-note').text(copy.note);
  });
  $('.ai-care-strip>span').text('تحديث المحتوى شهرياً · مراجعة جودة الإجابات · تحسين المطالبات ومسارات العمل · دعم بسيط');
  $('.care-grid article').each((i,el)=>{const texts=['تكاليف النطاق والاستضافة والمنصة منفصلة ما لم تُدرج صراحةً في العرض المكتوب.','تكاليف استخدام النماذج والاشتراكات والتكاملات المدفوعة منفصلة ما لم تُدرج في العرض المكتوب.','تعتمد أنظمة ذاكرة الشركة على مصادر متفق عليها ومعتمدة، ولا تجمع جميع الملفات أو المحادثات تلقائياً.'];$(el).find('p').text(texts[i]||'')});
}
function localizeArabic($,route){
  const copy=arabicRouteCopy[route];
  if(copy){setHtml($,copy.heading,copy.html);setText($,copy.lead,copy.leadText)}
  setText($,'.global-nav__brand small','استوديو إبداعي تقني');
  $('.global-nav__brand').attr('aria-label','BRAYROAI الرئيسية');
  $('.chapter-nav').attr('aria-label','أقسام هذه الصفحة');
  $('.global-nav__links').attr('aria-label','التنقل الرئيسي');
  $('.global-menu nav').attr('aria-label','التنقل الرئيسي للهاتف');
  $('.global-menu__market').text('اختر السوق والعملة');
  $('.market-trigger').contents().filter((_,node)=>node.type==='text').first().replaceWith('الإمارات · AED ');
  $('.global-nav__toggle').attr('aria-label','افتح القائمة');
  $('.global-menu__cta').contents().filter((_,node)=>node.type==='text').first().replaceWith('ابدأ مشروعاً ');
  $('.skip-link').text(route==='/plans'?'تجاوز إلى الخطط':route==='/terms'?'تجاوز إلى الشروط':'تجاوز إلى المحتوى');
  $('.global-footer nav').attr('aria-label','روابط أسفل الصفحة');
  $('.global-footer nav>div').eq(0).find('small').text('استكشف');
  $('.global-footer nav>div').eq(1).find('small').text('تعرّف أكثر');
  $('.global-footer nav>div').eq(2).find('small').text('تواصل معنا');
  const footerLabels={'Home':'الرئيسية','Client work':'أعمال العملاء','Plans':'الخطط','Founder':'المؤسس','Terms':'الشروط','Email Yash ↗':'راسل ياش ↗','WhatsApp ↗':'واتساب ↗','Ask Rae ↗':'اسأل راي ↗','BACK TO TOP ↑':'العودة إلى الأعلى ↑'};
  $('.global-footer a,.global-footer button').each((_,element)=>{const node=$(element),text=node.text().trim();if(footerLabels[text])node.text(footerLabels[text])});
  setText($,'.global-footer__base>span','© ٢٠٢٦ BRAYROAI · تصميم · هندسة · ذكاء اصطناعي مفيد');
  const nav={Home:'الرئيسية',Capabilities:'الخدمات',Clients:'العملاء',AI:'الذكاء الاصطناعي',Plans:'الخطط',Founder:'المؤسس',Terms:'الشروط',Contact:'تواصل'};
  $('.global-nav__links a,.global-menu nav a').each((_,element)=>{const key=$(element).text().trim();if(nav[key])$(element).text(nav[key])});
  $('.global-nav__cta,.global-menu__cta').contents().filter((_,node)=>node.type==='text').first().replaceWith('ابدأ مشروعاً ');
  $('.global-footer h2').html('لنصنع شيئاً<br><em>يستحق العودة إليه.</em>');
  setText($,'.global-footer__top>div>p','الاستراتيجية والواجهة والهندسة والذكاء الاصطناعي العملي، مع الشخص الذي يقود التنفيذ.');
  setText($,'.global-footer__top>div>small','BRAYROAI / نخدم الإمارات عن بُعد من بونه، الهند');
  setText($,'.global-footer__top>nav>div:last-child>span','نعمل عن بُعد مع الشركات في الإمارات من بونه، الهند');
  setText($,'.global-footer__cta','أخبرنا بما تريد بناءه ↗');
  if(route==='/'){
    setText($,'.hero__copy .eyebrow','استوديو إبداعي تقني / نخدم الإمارات عن بُعد');
    setHtml($,'#services .v12-capabilities__head h2','ابنِ الشيء المناسب.<br>ثم اجعله <em>لا يُنسى.</em>');
    setText($,'#services .v12-capabilities__head>p','نربط الرؤية بالواجهة والتنفيذ. ويمكن تخطيط المحتوى العربي والإنجليزي ومسارات الاستفسار عبر واتساب ضمن نطاق المشروع.');
    setHtml($,'#work .v12-work-head h2','العمل الحقيقي أقوى من الوعود.');
    setHtml($,'#ai-systems .v12-ai-head h2','ابدأ بنظام واحد مفيد.<br>لا بعشرة <em>أدوات جديدة.</em>');
    setHtml($,'#contact h2','احكِ لنا عن التحدي.<br><em>وسنجد له شكلاً واضحاً.</em>');
    translateArabicHome($);
  }
  if(route==='/plans'){
    setHtml($,'.plan-decision__heading h2','ابدأ بما تحتاجه.<br><em>ثم اختر الخطة.</em>');
    setText($,'.plan-decision__heading>p:last-child','مسار سريع لاختيار نوع التعاون المناسب. اطّلع على النطاق والأسعار المنشورة ثم شارك ياش ما تحتاج إليه.');
    const decision=[['شراكة شهرية','للموقع القائم الذي يحتاج إلى تصميم ومحتوى وتحسينات منتظمة.'],['موقع جديد','لتجربة رقمية متكاملة من التخطيط إلى الإطلاق المتجاوب.'],['نظام ذكاء اصطناعي','لتحديد فرصة عملية أو جعل المعرفة المعتمدة مفيدة للفريق.']];
    $('.plan-decision__card').each((i,el)=>{if(decision[i]){$(el).find('strong').text(decision[i][0]);$(el).find('p').text(decision[i][1])}});
    setHtml($,'#monthly .plan-heading h2','استمر في التحسين.<br>دون <em>البدء من جديد.</em>');
    setHtml($,'#builds .plan-heading h2','ابنِه بإتقان.<br>ثم <em>أطلقه.</em>');
    setHtml($,'#ai-systems .plan-heading h2','ابدأ بالوضوح.<br>ثم ابنِ <em>النظام المفيد.</em>');
    setText($,'.care__heading>p','الضرائب المطبقة والنطاقات والاستضافة واستخدام واجهات البرمجة والخدمات المدفوعة منفصلة، ما لم تُذكر في العرض المكتوب.');
    translateArabicPlans($);
  }
  if(route==='/founder')translateArabicFounder($);
  if(route==='/clients')translateArabicClientArchive($);
  if(route==='/clients/fakhrimart')translateArabicCaseIntro($);
  if(route.startsWith('/clients')){
    $('.client-nav__brand').attr('aria-label','BRAYROAI الرئيسية');
    $('.client-nav nav').attr('aria-label','التنقل في أعمال العملاء');
    $('.client-nav__cta').text('ابدأ مشروعاً ↗');
    $('.client-skip').text('تجاوز إلى أعمال العملاء');
  }
  if(route==='/ai-workflow-audit'||route==='/company-second-brain')translateArabicService($,route);
  if(route==='/terms')translateArabicTerms($);
  translateArabicLabels($);
  if(route==='/ai-workflow-audit')setText($,'.chapter-nav>span','تدقيق سير العمل');
  if(route==='/company-second-brain')setText($,'.chapter-nav>span','ذاكرة الشركة');
  if(route==='/terms'){
    $('.terms-hero__copy').append('<p class="market-legal-note">هذه خلاصة عربية لتيسير القراءة. تظل التفاصيل التعاقدية أدناه باللغة الإنجليزية إلى حين اعتماد مراجعة قانونية وترجمة بشرية متخصصة. يتم الاتفاق على السعر والنطاق والضرائب المطبقة كتابةً قبل بدء العمل.</p>');
    const headings=['ما الذي تقدمه BRAYROAI؟','العمل الشهري والمشروع الواحد مختلفان.','يبدأ العمل وفق جدول دفع متفق عليه.','النطاق والتعديلات يحتاجان إلى حدود واضحة.','الجدول الزمني يعتمد على الطرفين.','يوفر العميل المعلومات والموافقات اللازمة.','للخدمات الخارجية شروطها الخاصة.','تنتقل ملكية الأعمال وفق الاتفاق.','كيف يعمل الإلغاء؟','الضمان والدعم بعد التسليم.','حدود المسؤولية.','تفاصيل عملية أخيرة.'];
    $('.terms-section h2').each((i,el)=>{if(headings[i])$(el).text(headings[i])});
  }
  $('body').addClass('market-arabic');
  $('head').append('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preload" as="style" media="(min-width: 761px)" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=optional" data-layout-stable-fonts><noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=optional" media="(min-width: 761px)"></noscript>');
  $('head').append('<link rel="stylesheet" href="/market-rtl.css">');
}
function contactOffer($,element,route){
  const parent=$(element);
  const plan=parent.closest('[data-offer-id]').attr('data-offer-id');if(OFFERS[plan])return plan;
  if(parent.closest('.v12-product-card--audit').length||route==='/ai-workflow-audit')return'ai-workflow-audit';
  if(parent.closest('.v12-product-card--brain').length||route==='/company-second-brain')return'company-second-brain';
  const context=parent.closest('article,section').text().slice(0,600);
  if(/Second Brain/i.test(context))return'company-second-brain';
  if(/Workflow Audit/i.test(context))return'ai-workflow-audit';
  return'';
}
function localizeLinks($,market,route){
  $('a[href]').each((_,element)=>{
    const a=$(element),href=a.attr('href')||'';
    if(href.startsWith('/')&&!href.startsWith('//')){
      const [pathHash,fragment='']=href.split('#');
      const [pathname,search='']=pathHash.split('?');
      if(MARKET_ROUTES.includes(pathname||'/'))a.attr('href',marketRoute(market,pathname||'/',fragment?'#'+fragment:'')+(search?'?'+search:''));
    }else if(/^https:\/\/wa\.me\/919175524637/i.test(href)||href.startsWith('mailto:yashganesh.work@gmail.com')){
      const offerId=contactOffer($,element,route);const message=leadText({market,offerId,source:route,language:market==='ae-ar'?'ar':'en'});
      if(href.startsWith('mailto:')){
        const title=offerId?`${OFFERS[offerId].name} / ${priceFor(offerId,market)}`:'Project enquiry';
        a.attr('href',`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent(`BRAYROAI / ${MARKETS[market].contactName} / ${title}`)}&body=${encodeURIComponent(message)}`);
      }else a.attr('href',`https://wa.me/919175524637?text=${encodeURIComponent(message)}`);
      a.attr('data-market-lead',offerId||'general');
    }
  });
}
function addSEO($,market,route){
  const canonical=origin+marketRoute(market,route);
  $('title').text(`${title[market]}${route==='/'?'':` · ${route.split('/').at(-1).replaceAll('-',' ')}`}`);
  $('meta[name="description"]').attr('content',descriptions[market]);
  $('meta[property="og:title"]').attr('content',$('title').text());
  $('meta[property="og:description"]').attr('content',descriptions[market]);
  $('link[rel="canonical"]').attr('href',canonical);
  $('meta[property="og:url"]').attr('content',canonical);
  $('link[rel="alternate"][hreflang]').remove();
  for(const [lang,id] of [['en-AE','ae'],['ar-AE','ae-ar'],['en-AU','au'],['x-default','in']])$('head').append(`<link rel="alternate" hreflang="${lang}" href="${origin+marketRoute(id,route)}">`);
  if(route==='/plans'){
    const offers=Object.entries(OFFERS).map(([id,offer])=>({ '@type':'Offer',name:offer.name,priceCurrency:MARKETS[market].currency,price:String(priceFor(id,market).match(/[\d,]+/)?.[0]||'').replaceAll(',',''),url:origin+marketRoute(market,route)+(id==='ai-workflow-audit'||id==='company-second-brain'||id==='knowledge-care'?'#ai-systems':id.startsWith('monthly')?'#monthly':'#builds')}));
    $('head').append(`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'OfferCatalog',name:'BRAYROAI services',itemListElement:offers})}</script>`);
  }
}
for(const market of markets){
  for(const route of MARKET_ROUTES){
    const $=load(readFileSync(resolve('dist',source[route]),'utf8'),{decodeEntities:false});
    $('html').attr('lang',MARKETS[market].locale);if(market==='ae-ar')$('html').attr('dir','rtl');else $('html').removeAttr('dir');
    $('body').attr('data-market',market).attr('data-locale',MARKETS[market].locale);
    $('head').append(`<meta name="brayro-market" content="${market}">`);
    // Keep the shared same-origin market runtime. It derives the active market
    // from the localized URL and remains compatible with production script CSP.
    $('script[data-market-context]').attr('src','/market-context.js').empty();
    replacePrices($,market,route);
    if(market==='ae-ar')localizeArabic($,route);else localizeEnglish($,market,route);
    localizeLinks($,market,route);addSEO($,market,route);
    const html=$.html();
    if(html.includes('₹'))throw new Error(`INR leaked into ${market}${route}`);
    const file=resolve('dist',marketRoute(market,route).slice(1),'index.html');mkdirSync(dirname(file),{recursive:true});writeFileSync(file,html);
  }
}
// Add hreflang to the x-default pages without changing their original copy.
for(const route of MARKET_ROUTES){
  const file=resolve('dist',source[route]);const $=load(readFileSync(file,'utf8'),{decodeEntities:false});
  for(const [lang,id] of [['en-AE','ae'],['ar-AE','ae-ar'],['en-AU','au'],['x-default','in']])$('head').append(`<link rel="alternate" hreflang="${lang}" href="${origin+marketRoute(id,route)}">`);
  writeFileSync(file,$.html());
  if(route!=='/'){const clean=resolve('dist',route.slice(1),'index.html');mkdirSync(dirname(clean),{recursive:true});writeFileSync(clean,$.html())}
}
const urls=MARKET_ROUTES.flatMap(route=>['in',...markets].map(id=>origin+marketRoute(id,route)));
writeFileSync(resolve('dist/sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`);
writeFileSync(resolve('dist/robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Generated ${markets.length*MARKET_ROUTES.length} localized pages and sitemap.xml.`);
