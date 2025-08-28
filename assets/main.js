// Includes + interactions
(function(){
  const ready = (fn)=> document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

  async function includePartials(){
    const nodes = document.querySelectorAll('[data-include]');
    for(const n of nodes){
      const url = n.getAttribute('data-include');
      try{
        const res = await fetch(url, {cache:'no-cache'});
        const html = await res.text();
        n.outerHTML = html;
      }catch(err){
        console.error('Include error for', url, err);
      }
    }
  }

  function initNavAndFooter(){
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if(navToggle && nav){
      navToggle.addEventListener('click', ()=>{
        const open = nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    // Active link
    const path = location.pathname.replace(/index\.html$/, '');
    document.querySelectorAll('#site-nav a, .footer-nav a').forEach(a=>{
      const href = a.getAttribute('href');
      if(!href) return;
      const norm = href.replace(/index\.html$/, '');
      if(norm === path){ a.classList.add('active'); }
    });
    // Year in footer
    const y = document.getElementById('year');
    if(y){ y.textContent = new Date().getFullYear(); }
  }

  function initIntake(){
    const form = document.getElementById('intake-form');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const get = (id)=>{
        const el = document.getElementById(id);
        return el ? (el.value || '').toString().trim() : '';
      };
      const nom = get('nom');
      const email = get('email');
      const tel = get('tel');
      const age = get('age');
      const patrimoine = get('patrimoine');
      const objectifs = get('objectifs');
      const budget = get('budget');
      const horizon = get('horizon');
      const risque = get('risque');
      const dispos = get('dispos');
      const canal = get('canal');
      const message = get('message');
      const consent = document.getElementById('consent');
      if(consent && !consent.checked){
        alert('Veuillez accepter le consentement avant d’envoyer.');
        return;
      }
      const ethique = Array.from(document.querySelectorAll('input[name="ethique"]:checked')).map(i=>i.value).join(', ');

      const lines = [
        `Nom: ${nom}`,
        `Email: ${email}`,
        `Téléphone: ${tel}`,
        `Âge: ${age}`,
        `Patrimoine existant: ${patrimoine}`,
        `Objectifs: ${objectifs}`,
        `Budget épargne mensuelle: ${budget}`,
        `Horizon: ${horizon}`,
        `Tolérance au risque: ${risque}`,
        `Préférences éthiques: ${ethique}`,
        `Disponibilités: ${dispos}`,
        `Canal préféré: ${canal}`,
        `Message complémentaire: ${message}`,
        '',
        `Source: ${location.href}`
      ];

      const to = 'contact@ascendia.example';
      const subject = encodeURIComponent(`Demande de RDV – ${nom || 'Ascendia'}`);
      const body = encodeURIComponent(lines.join('\n'));
      const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
      setTimeout(()=>{ window.location.href = mailto; }, 0);
    });
  }

  ready(async ()=>{
    await includePartials();
    initNavAndFooter();
    initIntake();
  });
})();
