(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const t of s.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&c(t)}).observe(document,{childList:!0,subtree:!0});function r(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(e){if(e.ep)return;e.ep=!0;const s=r(e);fetch(e.href,s)}})();const S="https://api.quotable.io/random",b="./quotes.json",g=document.querySelector("body"),h=document.querySelector(".btn-setting"),i=document.querySelector(".setting"),E=document.getElementsByName("checkbox-mode")[0],d=document.getElementsByName("checkbox-autonext")[0],w=document.querySelector(".container"),a=document.querySelector(".quote-display"),u=document.querySelector(".quote-input"),I=document.querySelector(".control"),Q=document.querySelector(".btn-reload"),T=document.querySelector(".btn-copy");let l,p="",m="",f=0;const N=localStorage.getItem("mode");N&&(g.classList.add("dark-mode"),E.checked=!0);const O=()=>localStorage.getItem("autonext")!=="false";O()?d.checked=!0:d.checked=!1;const B=()=>{for(let n=0;n<2;n++){const o=document.createElement("div");o.classList.add("skeleton"),a.append(o)}},C=async()=>{const o=await(await fetch(b)).json(),{content:r,author:c}=o.quotes[f];m=`${r} ${c}`,f<o.quotes.length?f++:f=0},v=async()=>{try{const n=await fetch(S),{content:o,author:r}=await n.json();m=`${o} ${r}`}catch{return C()}},k=()=>{a.innerHTML="",u.value="";const n=m.split(" ");n.forEach((o,r)=>{const c=document.createElement("div");if(o.split("").forEach((e,s)=>{const t=document.createElement("span");t.classList.add("char"),r===0&&s===0&&t.classList.add("current"),t.innerText=e,c.appendChild(t)}),r<n.length-1){const e=document.createElement("span");e.classList.add("char"),e.innerText=" ",c.appendChild(e)}a.appendChild(c)})},y=()=>{l&&l.remove(),l=void 0,a.classList.remove("filter"),u.focus()};h.addEventListener("click",()=>{i.style.display==="block"?i.style.display="none":i.style.display="block"});E.addEventListener("click",()=>{g.classList.contains("dark-mode")?(g.classList.remove("dark-mode"),localStorage.setItem("mode","")):(g.classList.add("dark-mode"),localStorage.setItem("mode","dark"))});d.addEventListener("click",()=>{d.checked?localStorage.setItem("autonext",!0):localStorage.setItem("autonext",!1)});document.addEventListener("click",n=>{(a.contains(n.target)||l&&l.contains(n.target))&&y(),!i.contains(n.target)&&!h.contains(n.target)&&(i.style.display="none")});u.addEventListener("blur",function(n){a.classList.add("filter"),l||(l=document.createElement("div"),l.classList.add("info"),l.innerText="Click to active....",w.insertBefore(l,I))});u.addEventListener("input",n=>{const o=()=>{p="",k(),y()},r=document.querySelectorAll(".char"),c=n.target.value;c.length===1&&(p=m,v());let e=!0;r.forEach((t,x)=>{const L=c[x];L==null?(t.classList.remove("correct"),t.classList.remove("incorrect"),e=!1):L===t.innerText?(t.classList.add("correct"),t.classList.remove("incorrect")):(t.classList.remove("correct"),t.classList.add("incorrect"),e=!1)});const s=document.querySelector(".current");if(s&&s.classList.remove("current"),c.length<r.length&&r[c.length].classList.add("current"),e)if(d.checked)o();else{const t=document.createElement("button");t.classList.add("btn","btn-next"),t.innerHTML='<img class="icon" src="/icons/right-arrow.svg" alt="next" title="next quote"/>',t.title="next quote",t.addEventListener("click",o),a.appendChild(t)}});T.addEventListener("click",()=>{y();const n=p||m;navigator.clipboard.writeText(n)});Q.addEventListener("click",()=>{a.innerHTML="",u.value="",y(),q()});const q=async()=>{B(),await v(),k()};q();