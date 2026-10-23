'use strict';
const $=id=>document.getElementById(id);
const speed=$('speed'),distance=$('distance'),speedRange=$('speedRange'),distanceRange=$('distanceRange');
const storageKey='pitch-velocity-saved-v1';let saved=[];
try{const parsed=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(parsed))saved=parsed.filter(x=>x&&Number.isFinite(+x.s)&&Number.isFinite(+x.d)&&+x.s>0&&+x.d>0).slice(0,20)}catch{}
function valid(){return speed.value.trim()!==''&&distance.value.trim()!==''&&Number.isFinite(+speed.value)&&Number.isFinite(+distance.value)&&+speed.value>0&&+distance.value>0&&+speed.value<=150&&+distance.value<=100}
function result(){const s=+speed.value,d=+distance.value;return{s,d,e:s*60.5/d,t:d/(s*5280/3600)}}
function syncPresets(){document.querySelectorAll('[data-distance]').forEach(b=>{const selected=distance.value.trim()!==''&&Math.abs(+b.dataset.distance-(+distance.value))<.001;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))})}
function update(){syncPresets();if(!valid()){$('equivalent').textContent='—';$('reaction').textContent='—';$('difference').textContent='—';$('save').disabled=true;$('copy').disabled=true;return}const{s,d,e,t}=result();$('equivalent').textContent=e.toFixed(1);$('reaction').textContent=t.toFixed(3);$('difference').textContent=(e-s>=0?'+':'')+(e-s).toFixed(1);$('save').disabled=false;$('copy').disabled=false;if(s>=20&&s<=100)speedRange.value=s;if(d>=20&&d<=65)distanceRange.value=d}
function status(msg){$('status').textContent=msg}
function setValues(s,d){speed.value=s;distance.value=d;update()}
for(const el of [speed,distance])el.addEventListener('input',update);
speedRange.addEventListener('input',()=>{speed.value=speedRange.value;update()});distanceRange.addEventListener('input',()=>{distance.value=distanceRange.value;update()});
document.querySelectorAll('[data-distance]').forEach(b=>b.addEventListener('click',()=>{distance.value=b.dataset.distance;update()}));
function reset(){setValues(50,40);status('Reset to 50 MPH at 40 feet.')}
$('reset').addEventListener('click',reset);$('resetTop').addEventListener('click',reset);
$('copy').addEventListener('click',async()=>{if(!valid())return;const{s,d,e,t}=result();const txt=`Pitching machine: ${s} MPH at ${d} ft\nEquivalent at 60 ft 6 in: ${e.toFixed(1)} MPH\nTravel time: ${t.toFixed(3)} seconds`;try{await navigator.clipboard.writeText(txt);status('Results copied.')}catch{status('Clipboard unavailable in this browser.')}});
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(saved))}catch{status('Saving unavailable in this browser.')}}
function renderSaved(){const ul=$('saved');ul.replaceChildren();if(!saved.length){const li=document.createElement('li');li.className='empty';li.textContent='No saved settings yet. Tap Save Setting to add one.';ul.append(li);return}saved.forEach((entry,i)=>{const li=document.createElement('li');li.className='saved-item';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=`BP ${entry.d}′ – ${entry.s} MPH`;const sub=document.createElement('small');sub.textContent=`${(entry.s*60.5/entry.d).toFixed(1)} MPH  |  ${(entry.d/(entry.s*5280/3600)).toFixed(3)} sec`;info.append(title,sub);const actions=document.createElement('div');actions.className='saved-actions';const load=document.createElement('button');load.className='mini';load.textContent='Load';load.setAttribute('aria-label',`Load ${entry.s} MPH at ${entry.d} feet`);load.onclick=()=>{setValues(entry.s,entry.d);status('Saved setting loaded.');showPage('calculator')};const remove=document.createElement('button');remove.className='mini';remove.textContent='×';remove.setAttribute('aria-label',`Delete ${entry.s} MPH at ${entry.d} feet`);remove.onclick=()=>{saved.splice(i,1);persist();renderSaved()};actions.append(load,remove);li.append(info,actions);ul.append(li)})}
$('save').addEventListener('click',()=>{if(!valid())return;const{s,d}=result();saved.unshift({s,d});saved=saved.slice(0,20);persist();renderSaved();status('Setting saved on this device.')});
$('manage').addEventListener('click',()=>{if(!saved.length){status('No saved settings to manage.');return}if(confirm('Delete all saved settings on this device?')){saved=[];persist();renderSaved();status('Saved settings cleared.')}});
const tbody=$('referenceRows');for(const s of [45,50,55,60,65,70]){const tr=document.createElement('tr');for(const value of [s,(s*60.5/40).toFixed(1),(40/(s*5280/3600)).toFixed(3)]){const td=document.createElement('td');td.textContent=value;tr.append(td)}tbody.append(tr)}
function showPage(page){const details=page==='details';$('page-calculator').hidden=details;$('page-details').hidden=!details;document.querySelectorAll('.nav button').forEach(b=>{const active=b.dataset.page===page;b.classList.toggle('selected',active);b.setAttribute('aria-current',active?'page':'false')});window.scrollTo({top:0,behavior:'instant'})}
$('nextPage').addEventListener('click',()=>showPage('details'));
$('backPage').addEventListener('click',()=>showPage('calculator'));
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
let installPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false});$('install').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('install').hidden=true});window.addEventListener('appinstalled',()=>{$('install').hidden=true;status('App installed.')});
if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
update();renderSaved();
