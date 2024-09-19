import{_ as I}from"./D5frcmkF.js";import{q as Q,d as o,e as U,c as n,a as t,f as r,w as c,h as $,t as m,y as d,b as y,F as v,g as x,z,o as s,r as C,A as D}from"./CrqhMiQy.js";import{_ as O}from"./BEMygrUP.js";import{_ as T}from"./DOD0tu6-.js";import{_ as Z}from"./fW5NUN-W.js";const G={class:"flex","aria-label":"Breadcrumb"},H={class:"inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"},J={class:"inline-flex items-center"},K=t("svg",{class:"me-2.5 h-3 w-3","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",viewBox:"0 0 20 20"},[t("path",{d:"m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"})],-1),W={key:0},X={class:"flex items-center"},Y=t("svg",{class:"mx-1 h-3 w-3 text-gray-400 rtl:rotate-180","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},[t("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"})],-1),ee={key:1},te={class:"flex items-center"},se=t("svg",{class:"mx-1 h-3 w-3 text-gray-400 rtl:rotate-180","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 6 10"},[t("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m1 9 4-4-4-4"})],-1),oe={class:"ms-1 text-sm font-medium text-gray-500 md:ms-2"},ae={class:"flex flex-col items-center justify-center space-y-4 px-3 py-8 md:py-12 xl:py-16"},re={class:"mb-4 text-center text-2xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl"},ne={class:"bg-gradient-to-r from-yellow-400 to-primary-600 bg-clip-text text-transparent"},ce={class:"relative w-full max-w-md"},le={key:0},ue={key:1,class:"p-4 text-center text-gray-500"},ie={class:"font-semibold"},de={class:"col-span-full p-4 text-center text-gray-500"},_e={class:"font-semibold"},me=t("hr",null,null,-1),pe=t("h6",{class:"p-4 text-xl font-bold"},"Últimos productos agregados",-1),ge=t("h6",{class:"p-4 text-xl font-bold"},"Productos más cotizados",-1),ke={__name:"index",setup(fe){const p=Q().params.slug,g=o(""),N=o(""),w=o("");o([]);const V=o([]),j=o([]),l=o(""),f=o([]);o(!1);const F=o(!0),S=o(!0),h=o(!1),_=o(!1),b=e=>{D(e,{supplierProductId:e.id,unitOfMeasure:e.unitOfMeasure})},k=e=>{console.log("Selected product",e.id)},M=async()=>{try{const e=await fetch(x(`/guest/subcategoria/getsubcategorydetailsbyslug/${p}`));if(!e.ok)throw new Error("Failed to fetch subcategory details");const a=await e.json();g.value=a.subcategory.name,N.value=a.category.name,w.value=a.category.slug}catch(e){console.error("Error fetching subcategory details:",e)}},A=async()=>{try{const e=await fetch(x(`/guest/subcategoria/getrecentsupplierproductsbysubcategory/${p}`));if(!e.ok)throw new Error("Failed to fetch recent products");const a=await e.json();V.value=a.data}catch(e){console.error(e)}finally{F.value=!1}},L=async()=>{try{const e=await fetch(x(`/guest/subcategoria/getmostquotedproductsbysubcategory/${p}`));if(!e.ok)throw new Error("Failed to fetch most quoted products");const a=await e.json();j.value=a.data}catch(e){console.error(e)}finally{S.value=!1}},R=async()=>{if(l.value.trim()===""){f.value=[],_.value=!1,h.value=!1;return}h.value=!0,_.value=!1;try{const e=await fetch(x(`/guest/subcategoria/searchsupplierproductsbysubcategory/${p}?query=${l.value}`));if(!e.ok)throw new Error("Failed to search products");const a=await e.json();f.value=a.data,f.value.length===0&&(_.value=!0)}catch(e){console.error(e),_.value=!0}finally{h.value=!1}};return U(()=>{M(),A(),L()}),(e,a)=>{const E=I,q=z,P=O,i=T,B=Z;return s(),n(v,null,[t("nav",G,[t("ol",H,[t("li",J,[r(E,{to:"/",class:"inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"},{default:c(()=>[K,y(" Inicio ")]),_:1})]),w.value?(s(),n("li",W,[t("div",X,[Y,r(E,{to:{name:"catalogo-categoria-slug",params:{slug:w.value}},class:"ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ms-2"},{default:c(()=>[y(m(N.value),1)]),_:1},8,["to"])])])):$("",!0),g.value?(s(),n("li",ee,[t("div",te,[se,t("div",oe,m(g.value),1)])])):$("",!0)])]),t("div",ae,[t("h1",re,[t("span",ne,m(g.value),1)]),t("div",ce,[r(q,{type:"text",modelValue:l.value,"onUpdate:modelValue":a[0]||(a[0]=u=>l.value=u),onInput:R,placeholder:"Buscar en subcategoria...",class:"mb-4 w-full rounded border p-2"},null,8,["modelValue"])])]),l.value?(s(),n("div",le,[h.value?(s(),d(i,{key:0},{default:c(()=>[(s(),n(v,null,C(6,u=>r(P,{key:u})),64))]),_:1})):_.value?(s(),n("div",ue,[y(" No se encontró ningún producto llamado "),t("span",ie,m(l.value),1)])):(s(),d(i,{key:2},{default:c(()=>[t("p",de,[y(" Productos encontrados para "),t("span",_e,m(l.value),1)]),r(B,{products:f.value,onAgregar:b,updatePrice:k},null,8,["products"])]),_:1}))])):$("",!0),me,t("div",null,[pe,F.value?(s(),d(i,{key:0},{default:c(()=>[(s(),n(v,null,C(6,u=>r(P,{key:u})),64))]),_:1})):(s(),d(i,{key:1},{default:c(()=>[r(B,{products:V.value,onAgregar:b,updatePrice:k},null,8,["products"])]),_:1}))]),t("div",null,[ge,S.value?(s(),d(i,{key:0},{default:c(()=>[(s(),n(v,null,C(6,u=>r(P,{key:u})),64))]),_:1})):(s(),d(i,{key:1},{default:c(()=>[r(B,{products:j.value,onAgregar:b,updatePrice:k},null,8,["products"])]),_:1}))])],64)}}};export{ke as default};
