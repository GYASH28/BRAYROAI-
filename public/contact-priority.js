(() => {
  const phone='919175524637';
  const email='yashganesh.work@gmail.com';
  const whatsapp=(message)=>`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const body=document.body;
  document.querySelectorAll('[data-brayro-whatsapp]').forEach(link=>{
    link.href=whatsapp(link.dataset.brayroWhatsapp||'Hi Yash, I would like to discuss a project with BRAYROAI.');
    link.target='_blank';
    link.rel='noreferrer';
  });
  if(!document.querySelector('.brayro-contact-dock')){
    const dock=document.createElement('nav');
    dock.className='brayro-contact-dock';
    dock.setAttribute('aria-label','Contact BRAYROAI');
    dock.innerHTML=`<a class="brayro-contact-dock__whatsapp" href="${whatsapp('Hi Yash, I would like to discuss a project with BRAYROAI.')}" target="_blank" rel="noreferrer" aria-label="Chat with BRAYROAI on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.6-4.1A8 8 0 1 1 20 11.5Z"/><path d="M8.7 8.5c.3 2 2.1 3.9 4.2 4.4l1.2-1.2 1.6.7c-.3 1.2-1.4 1.8-2.4 1.6-3.3-.7-5.5-3-6.1-6.1-.2-1 .5-2.1 1.6-2.4l.7 1.6-1.2 1.4Z"/></svg><span>WhatsApp</span></a><a class="brayro-contact-dock__email" href="mailto:${email}?subject=${encodeURIComponent('BRAYROAI project enquiry')}" aria-label="Email BRAYROAI"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><span>Email</span></a>`;
    body.append(dock);
  }
})();
