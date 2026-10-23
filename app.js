'use strict';
const $ = id => document.getElementById(id);
const speed = $('speed'), distance = $('distance'), speedRange = $('speedRange'), distanceRange = $('distanceRange');
const storageKey='pitch-velocity-saved-v1';
let saved=[];try{const parsed=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(parsed))saved=parsed.slice(0,20)}catch{}
function valid(){return Number.isFinite(+speed.value)&&Number.isFinite(+distance.value)&&+speed.value>0&&+distance.value>0&&+speed.value<=150&&+distance.value<=100}
function result(){const s=+speed.value,d=+distance.value;return {s,d,e:s*60.5/d,t:d/(s*5280/3600)}}
function update(){if(!valid()){$('equivalent').textContent='—';$('reaction').textContent='—';$('difference').textContent='—';$('save').disabled=true;$('copy').disabled=true;return}const {s,d,e,t}=result();$('equivalent').textContent=e.toFixed(1);$('reaction').textContent=t.toFixed(3)+' sec';$('difference').textContent=(e-s>=0?'+':'')+(e-s).toFixed(1)+' MPH';$('save').disabled=false;$('copy').disabled=false;if(s>=+speedRange.min&&s<=+speedRange.max)speedRange.value=s;if(d>=+distanceRange.min&&d<=+distanceRange.max)distanceRange.value=d}
function status(msg){$('status').textContent=msg}
function setValues(s,d){speed.value=s;distance.value=d;update()}
for(const el of [speed,distance])el.addEventListener('input',update);
speedRange.addEventListener('input',()=>{speed.value=speedRange.value;update()});distanceRange.addEventListener('input',()=>{distance.value=distanceRange.value;update()});
document.querySelectorAll('[data-distance]').forEach(b=>b.addEventListener('click',()=>{distance.value=b.dataset.distance;update()}));
$('reset').addEventListener('click',()=>{setValues(50,40);status('Reset to 50 MPH at 40 feet.')});
$('copy').addEventListener('click',async()=>{if(!valid())return;const {s,d,e,t}=result();const txt=`Pitching machine: ${s} MPH at ${d} ft\nEquivalent at 60 ft 6 in: ${e.toFixed(1)} MPH\nTravel time: ${t.toFixed(3)} seconds`;try{await navigator.clipboard.writeText(txt);status('Results copied.')}catch{status('Clipboard unavailable. Use a secure HTTPS connection.')}});
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(saved))}catch{status('Saving is unavailable in this browser.')}}
function renderSaved(){const ul=$('saved');ul.replaceChildren();if(!saved.length){const li=document.createElement('li');li.textContent='No saved settings yet.';ul.append(li);return}saved.forEach((entry,i)=>{const li=document.createElement('li');const info=document.createElement('div');const title=document.createElement('strong');title.textContent=`${entry.s} MPH at ${entry.d} ft`;const sub=document.createElement('small');sub.textContent=`Equivalent: ${(entry.s*60.5/entry.d).toFixed(1)} MPH`;info.append(title,sub);const load=document.createElement('button');load.textContent='Load';load.setAttribute('aria-label',`Load ${entry.s} MPH at ${entry.d} feet`);load.onclick=()=>{setValues(entry.s,entry.d);status('Saved setting loaded.')};const remove=document.createElement('button');remove.textContent='×';remove.setAttribute('aria-label',`Delete ${entry.s} MPH at ${entry.d} feet`);remove.onclick=()=>{saved.splice(i,1);persist();renderSaved()};li.append(info,load,remove);ul.append(li)})}
$('save').addEventListener('click',()=>{if(!valid())return;const {s,d}=result();saved.unshift({s,d});saved=saved.slice(0,20);persist();renderSaved();status('Setting saved on this device.')});
let installPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false});$('install').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('install').hidden=true});window.addEventListener('appinstalled',()=>{$('install').hidden=true;status('App installed.')});
if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
update();renderSaved();
