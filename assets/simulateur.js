// Simulateur de progression
(function(){
  const form = document.getElementById('sim-form');
  const freq = document.getElementById('frequence');
  const out = document.getElementById('freqOut');
  const result = document.getElementById('result');
  const summary = document.getElementById('summary');
  const timeline = document.getElementById('timeline');
  const reco = document.getElementById('reco-list');

  if(!form) return;
  freq.addEventListener('input', ()=> out.textContent = freq.value);

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const niveau = document.getElementById('niveau').value;
    const objectif = document.getElementById('objectif').value;
    const f = parseInt(freq.value,10);

    // Modèle simple: nombre d'étapes et durée par étape varient selon niveau/objectif
    const baseWeeks = { debutant: 8, intermediaire: 6, avance: 4 }[niveau];
    const objectiveFactor = {
      waterstart: 1.0,
      jibe: 1.1,
      planning: 0.9,
      foil: 1.3
    }[objectif];

    const sessionsNeeded = Math.round(baseWeeks * 2 * objectiveFactor); // 2 sessions/sem de base
    const weeks = Math.max(2, Math.ceil(sessionsNeeded / f));

    summary.textContent = `Avec ${f} séance(s)/semaine, vous pouvez atteindre votre objectif en environ ${weeks} semaines.`;

    // Construire une timeline en 4 phases
    timeline.innerHTML = '';
    const phases = [
      { t:'Fondamentaux', d: Math.max(1, Math.round(weeks*0.25)), k:['équilibre','position','guidage voile'] },
      { t:'Compétences clés', d: Math.max(1, Math.round(weeks*0.3)), k: objectif==='jibe'?['courbes larges','placement pieds','regard']:
                                           objectif==='waterstart'?['placement planche','levée de voile','timing risée']:
                                           objectif==='planning'?['abattée','pomping','réglages harnais/straps']:
                                           ['portance','vitesse mini','assiette foil'] },
      { t:'Consolidation', d: Math.max(1, Math.round(weeks*0.25)), k:['répétitions','vidéo-feedback','variante vent'] },
      { t:'Autonomie', d: weeks - (Math.max(1, Math.round(weeks*0.25)) + Math.max(1, Math.round(weeks*0.3)) + Math.max(1, Math.round(weeks*0.25))), k:['routine sécurité','check météo/spot','plan de séance'] },
    ];

    phases.forEach((p,i)=>{
      const step = document.createElement('div');
      step.className = 'step';
      step.innerHTML = `<div class="wk">Semaine ${i+1}–${i+p.d}</div><div class="t">${p.t}</div><ul>${p.k.map(x=>`<li>${x}</li>`).join('')}</ul>`;
      timeline.appendChild(step);
    });

    // Recommandations
    const recommends = [];
    if(niveau==='debutant') recommends.push('Planche volumineuse (150–180L), voile 3.5–5.0m²');
    if(niveau!=='debutant') recommends.push('Harnais adapté, réglages straps progressifs');
    if(objectif==='waterstart') recommends.push('Combinaison flottabilité, pratique en eau profonde encadrée');
    if(objectif==='jibe') recommends.push('Flotteur freeride maniable, aileron adapté');
    if(objectif==='planning') recommends.push('Surface de voile adéquate, pomping technique');
    if(objectif==='foil') recommends.push('Foil freeride stable, zones dégagées, casque obligatoire');

    reco.innerHTML = recommends.map(r=>`<li>${r}</li>`).join('');

    result.classList.remove('hidden');
    result.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();
