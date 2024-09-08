import{_ as D}from"./Bc_7XvHW.js";import{d as g,q as M,e as N,c as r,a as t,f as c,w as d,h as v,t as n,F as _,r as p,g as y,C as A,o as i,b as h,i as E,v as I,u as m,n as O,z as P,D as q}from"./BET-V8ZF.js";import{Q as z,V as F,N as L}from"./CZhTqw-T.js";import{r as S}from"./tQi0cZQx.js";import"./DdTw_I6L.js";const T={class:"flex","aria-label":"Breadcrumb"},R={class:"inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"},U={class:"inline-flex items-center"},G=t("svg",{class:"me-2.5 h-3 w-3","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 20 20"},[t("path",{d:"m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"})],-1),Q={key:0},W={class:"flex items-center"},Z=t("svg",{class:"mx-1 h-3 w-3 text-gray-400 rtl:rotate-180","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},[t("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"})],-1),H={key:1},J={class:"flex items-center"},K=t("svg",{class:"mx-1 h-3 w-3 text-gray-400 rtl:rotate-180","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},[t("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"})],-1),X={class:"ms-1 text-sm font-medium text-gray-500 md:ms-2"},Y={class:"mx-auto max-w-screen-lg bg-white p-2 font-sans sm:p-4"},tt={class:"grid grid-cols-1 gap-8 lg:grid-cols-2"},et={class:"flex justify-center"},st={class:"flex aspect-square h-96 items-center justify-center text-center"},at=["src"],ot={class:"flex flex-wrap items-start gap-4"},nt={class:"text-2xl font-semibold"},rt={class:"text-sm"},it=t("hr",{class:"my-8"},null,-1),lt={class:"flex gap-2"},ct={class:"mt-4 flex items-center"},dt=["onClick"],ut=["onUpdate:modelValue","onChange"],mt=["onClick"],gt=["onClick"],_t={class:"mt-6"},ht=t("h2",{class:"text-xl font-semibold"},"Características",-1),xt={class:"mt-2"},Ct={__name:"index",setup(ft){const u=g(null),w=M().params.slug,l=g({category:null,subcategory:null}),x=g([]),b=async()=>{try{const e=await fetch(y(`/guest/producto/getproductdetailsbysupplierproductslug/${w}`));if(!e.ok)throw new Error("Failed to fetch product details");const o=await e.json();o.data.cantidad=1,x.value=[o.data],u.value=o.data.productId,console.log("Product ID:",u)}catch(e){console.error(e)}},k=async e=>{try{const o=await A(y(`/guest/producto/${e}/category-subcategory`),"GET");l.value=o}catch(o){console.error("Error fetching category and subcategory data:",o)}},C=e=>{e.cantidad+=1},V=e=>{e.cantidad>1&&(e.cantidad-=1)},j=e=>{e.cantidad<1&&(e.cantidad=1)},B=e=>{P(e,{unitOfMeasure:e.unitOfMeasure,cantidad:e.cantidad}),q(e.id,e.unitOfMeasure,e.cantidad)};return N(async()=>{await b(),u.value&&await k(u.value)}),(e,o)=>{const f=D;return i(),r(_,null,[t("nav",T,[t("ol",R,[t("li",U,[c(f,{to:"/",class:"inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"},{default:d(()=>[G,h(" Inicio ")]),_:1})]),l.value.category?(i(),r("li",Q,[t("div",W,[Z,c(f,{to:{name:"catalogo-categoria-slug",params:{slug:l.value.category.slug}},class:"ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ms-2"},{default:d(()=>[h(n(l.value.category.name)+"s ",1)]),_:1},8,["to"])])])):v("",!0),l.value.subcategory?(i(),r("li",H,[t("div",J,[K,t("div",X,n(l.value.subcategory.name),1)])])):v("",!0)])]),t("div",Y,[(i(!0),r(_,null,p(x.value,s=>(i(),r("div",{key:s.id},[t("div",tt,[t("div",et,[t("div",st,[t("img",{src:s.photo,alt:"product image",class:"aspect-square size-full rounded-md object-cover"},null,8,at)])]),t("div",null,[t("div",ot,[t("p",nt,n(s.name)+" - "+n(s.unitOfMeasure),1),t("p",rt,n(s.description),1)]),it,t("div",lt,[t("div",ct,[t("button",{onClick:a=>V(s),class:"h-10 w-10 rounded-lg bg-gray-200 text-gray-700"},"-",8,dt),E(t("input",{type:"number","onUpdate:modelValue":a=>s.cantidad=a,class:"mx-2 h-10 w-16 rounded-lg border border-gray-200 bg-white text-center text-gray-900",onChange:a=>j(s)},null,40,ut),[[I,s.cantidad,void 0,{number:!0}]]),t("button",{onClick:a=>C(s),class:"h-10 w-10 rounded-lg bg-gray-200 text-gray-700"},"+",8,mt)]),t("button",{onClick:a=>B(s),class:"mt-4 w-full rounded bg-primary-500 p-2 text-white"},"Añadir",8,gt)])])]),t("div",_t,[ht,t("ul",xt,[(i(!0),r(_,null,p(s.features,a=>(i(),r("li",{key:a.id,class:"mt-2"},[c(m(L),{as:"div",class:"mt-2"},{default:d(({open:$})=>[c(m(z),{class:"flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75"},{default:d(()=>[t("span",null,n(a.name)+": "+n(a.value),1),c(m(S),{class:O([{"rotate-180 transform":!$},"h-5 w-5 text-gray-500"])},null,8,["class"])]),_:2},1024),c(m(F),{class:"px-4 pb-2 pt-4 text-sm text-gray-500"},{default:d(()=>[h(n(a.description),1)]),_:2},1024)]),_:2},1024)]))),128))])])]))),128))])],64)}}};export{Ct as default};
