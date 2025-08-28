// Admin tool for blog: access key gate + DOCX -> HTML via Mammoth.js
(function(){
  const ready = (fn)=> document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

  // CHANGE THIS KEY before deploying
  const ACCESS_KEY = 'Marc-Ascendia-2025-87.';

  function slugify(str){
    return (str || '')
      .toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 80);
  }

  function scaffoldHtml({title, description, bodyHtml, slug}){
    const canonical = `/blog/${slug}.html`;
    return `<!doctype html>\n<html lang="fr">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>${title || 'Article du blog'}</title>\n  <meta name="description" content="${(description||'').replace(/\"/g,'&quot;')}" />\n  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n  <link rel="stylesheet" href="/assets/styles.css" />\n  <link rel="canonical" href="${canonical}" />\n  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />\n</head>\n<body>\n  <div data-include="/partials/header.html"></div>\n\n  <main class="container prose">\n    <article>\n${bodyHtml}\n    </article>\n  </main>\n\n  <div data-include="/partials/footer.html"></div>\n  <script src="/assets/main.js" defer></script>\n</body>\n</html>\n`;
  }

  function enableAdminIfKeyMatches(){
    const keyInput = document.getElementById('access-key');
    const panel = document.getElementById('admin-panel');
    if(!keyInput || !panel) return;

    const unlock = ()=>{
      const v = (keyInput.value || '').trim();
      if(!v) return;
      if(v === ACCESS_KEY){
        panel.style.display = '';
        keyInput.setAttribute('disabled','disabled');
      }else{
        alert('Clé invalide');
      }
    };

    keyInput.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){ unlock(); }
    });
    keyInput.addEventListener('blur', unlock);
  }

  function initConverter(){
    const fileInput = document.getElementById('docx-file');
    const preview = document.getElementById('preview');
    const btnDownload = document.getElementById('download-html');
    const titleEl = document.getElementById('title');
    const descEl = document.getElementById('description');
    const slugEl = document.getElementById('slug');

    let lastHtml = '';

    async function handleFile(){
      const file = fileInput.files && fileInput.files[0];
      if(!file){ return; }
      try{
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.convertToHtml({arrayBuffer});
        let html = result.value || '';
        // Basic cleanup: wrap headings if missing
        const temp = document.createElement('div');
        temp.innerHTML = html;
        // Try to detect title from the first h1/h2
        const h = temp.querySelector('h1, h2');
        if(h && !titleEl.value){ titleEl.value = h.textContent.trim(); }
        if(!slugEl.value && titleEl.value){ slugEl.value = slugify(titleEl.value); }
        lastHtml = temp.innerHTML;
        preview.innerHTML = lastHtml;
        btnDownload.disabled = !(lastHtml && (slugEl.value||'').length > 0);
      }catch(err){
        console.error(err);
        alert('Erreur de conversion du fichier .docx');
      }
    }

    function refreshDownloadState(){
      btnDownload.disabled = !(lastHtml && (slugEl.value||'').length > 0);
    }

    fileInput && fileInput.addEventListener('change', handleFile);
    titleEl && titleEl.addEventListener('input', ()=>{
      if(!slugEl.value){ slugEl.value = slugify(titleEl.value); }
      refreshDownloadState();
    });
    slugEl && slugEl.addEventListener('input', refreshDownloadState);

    btnDownload && btnDownload.addEventListener('click', ()=>{
      const title = (titleEl && titleEl.value) || '';
      const description = (descEl && descEl.value) || '';
      const slug = (slugEl && slugEl.value) || '';
      if(!slug){ alert('Veuillez saisir un slug'); return; }
      const html = scaffoldHtml({title, description, bodyHtml: lastHtml, slug});
      const blob = new Blob([html], {type:'text/html'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${slug}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    });
  }

  ready(()=>{
    enableAdminIfKeyMatches();
    initConverter();
  });
})();
