import{d as l,o as s,c as a,f as n,w as m,a as e,i as W,M as J,t as v,B as K,n as N,u as L,s as X,T as ve,h as C,H as fe,e as he,F as h,E as w,g as k,r as S,S as ye,j as ge,x as y,_ as xe,y as be}from"./DaUbdcHR.js";import{_ as we}from"./DAP_5hhF.js";import{_ as ke,a as Se}from"./cL0d3h_L.js";import"./CDrXyv1J.js";const Ce={class:"relative flex flex-col justify-between rounded-xl bg-white bg-clip-border p-2 text-gray-700 transition-all duration-200 hover:shadow-md"},$e={class:"relative aspect-square overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700"},Be=["src"],Me={class:"flex h-full w-full animate-pulse items-center justify-center bg-gray-200"},Pe=e("svg",{class:"h-5 w-5 animate-spin text-gray-500",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},[e("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"}),e("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C6.48 0 2 4.48 2 10h2zm2 5.29l-1.42-1.42C6.6 14.09 7 12.6 7 11H5c0 1.76-.55 3.4-1.49 4.71L6 17.29z"})],-1),Ve=[Pe],je={class:"p-2 sm:p-3"},Ne={class:"mb-2 flex items-center justify-between"},Ie={class:"line-clamp-2 font-sans text-sm font-medium leading-relaxed text-gray-900 antialiased"},Le={class:"line-clamp-2 font-sans text-xs font-normal leading-normal text-gray-700 antialiased opacity-75 sm:line-clamp-3"},Te={class:"flex justify-between p-2"},Ae={class:"line-clamp-2 font-sans text-sm font-medium leading-relaxed text-gray-900 antialiased"},Ee={class:"line-clamp-2 font-sans text-sm font-medium leading-relaxed text-gray-900 antialiased"},ze={__name:"Product",props:{product:Object,updatePrice:Function},emits:["agregar"],setup(_,{emit:c}){const u=l(!0),g=()=>{u.value=!1};return(x,I)=>{const $=we;return s(),a("div",Ce,[n($,{class:"pointer"},{default:m(()=>[e("div",$e,[W(e("img",{src:_.product.photo,onLoad:g,alt:"card-image",class:"h-full w-full object-cover object-center"},null,40,Be),[[J,!u.value]]),W(e("div",Me,Ve,512),[[J,u.value]])]),e("div",je,[e("div",Ne,[e("p",Ie,v(_.product.name),1)]),e("p",Le,v(_.product.description),1)])]),_:1}),e("div",Te,[e("div",Ae,"S/. "+v(_.product.price),1),e("div",Ee,v(_.product.unitOfMeasure),1)])])}}},Ge={__name:"Submain",setup(_){return(c,u)=>(s(),a("div",{class:N(["grid gap-2 sm:gap-4",L(X)?"grid-cols-2 md:grid-cols-3 2xl:grid-cols-4":"grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"])},[K(c.$slots,"default")],2))}},Re={__name:"Main",setup(_){return(c,u)=>(s(),a("div",{class:N(["grid gap-2 sm:gap-4",L(X)?"md:grid-cols-6 xl:grid-cols-8":"md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"])},[K(c.$slots,"default")],2))}},Ue={__name:"Notification",props:{message:String,type:String,duration:{type:Number,default:3e3}},setup(_){const c=_,u=l(!1);return ve(()=>c.message,g=>{g&&(u.value=!0,setTimeout(()=>{u.value=!1},c.duration))}),(g,x)=>u.value?(s(),a("div",{key:0,class:N(["fixed bottom-4 left-4 rounded-lg p-4 shadow-lg transition-transform",_.type==="success"?"bg-primary-600 text-white":"bg-red-600 text-white"])},v(_.message),3)):C("",!0)}},qe={class:"overflow-auto rounded-lg border bg-white md:col-span-2"},De=e("h6",{class:"p-3 text-lg font-bold"},"Categorías",-1),Fe={class:"overflow-auto"},He=["onClick"],Oe={class:"flex items-center gap-2"},Qe={class:"flex h-full w-full items-center justify-center"},We={class:"flex h-full w-full items-center justify-center"},Je={class:"select-none font-sans text-xs font-normal leading-normal antialiased"},Ke={key:0},Xe=["onClick"],Ye={class:"flex items-center gap-2"},Ze={class:"select-none font-sans text-xs font-normal leading-normal antialiased"},et={key:0},tt={key:0},st=e("p",null,"Cargando productos...",-1),ot=[st],at={key:1},lt={class:"flex justify-between"},rt=e("h6",{class:"p-1.5 text-lg font-bold"},"Buscar Productos",-1),nt=e("span",{class:"ml-2 hidden md:block"}," Agregar nuevo producto",-1),ct={key:0},it=e("p",null,"Cargando resultados...",-1),ut=[it],dt={key:0},pt=e("h6",{class:"mt-4 p-3 text-lg font-bold"},"Productos",-1),_t={key:1},mt={key:0},vt=e("p",null,"Cargando productos...",-1),ft=[vt],ht={key:1},yt={class:"flex justify-between"},gt=e("h6",{class:"p-1.5 text-lg font-bold"},"Buscar Productos en Categoría",-1),xt=e("span",{class:"ml-2 hidden md:block"}," Agregar nuevo producto",-1),bt={key:0},wt=e("p",null,"Cargando resultados...",-1),kt=[wt],St={key:0},Ct=e("h6",{class:"mt-4 p-3 text-lg font-bold"},"Productos",-1),$t={key:2},Bt={key:0},Mt=e("p",null,"Cargando productos...",-1),Pt=[Mt],Vt={key:1},jt={class:"flex justify-between"},Nt=e("h6",{class:"p-1.5 text-lg font-bold"},"Buscar Productos en Subcategoría",-1),It=e("span",{class:"ml-2 hidden md:block"}," Agregar nuevo producto",-1),Lt={key:0},Tt=e("p",null,"Cargando resultados...",-1),At=[Tt],Et={key:0},zt=e("h6",{class:"mt-4 p-3 text-lg font-bold"},"Productos",-1),Ft={__name:"index",setup(_){const c=fe(),u=l([]),g=l([]),x=l([]),I=l([]),$=l([]),B=l([]),d=l(""),b=l(""),Y=l(!0),f=l(!1),T=l(!1),A=l(!1),E=l(!1),i=l(null),p=l(null),Z=async()=>{try{const t=await w(k(`/supplier/misproductos/getcategoriesbysupplier2/${c}`),"GET");u.value=t.data}catch(t){console.error(t)}finally{Y.value=!1}},ee=async t=>{try{const r=await w(k(`/supplier/misproductos/getsubcategoriesbysupplierandcategory/${c}/${t}`),"GET");g.value=r.data}catch(r){console.error(r)}},z=async()=>{f.value=!0;try{const t=await w(k(`/supplier/misproductos/getproductsbysupplier/${c}`),"GET");x.value=t.data}catch(t){console.error(t)}finally{f.value=!1}},G=async t=>{f.value=!0;try{const r=await w(k(`/supplier/misproductos/getproductsbysupplierandcategory/${c}/${t}`),"GET");x.value=r.data}catch(r){console.error(r)}finally{f.value=!1}},D=async t=>{f.value=!0;try{const r=await w(k(`/supplier/misproductos/getproductsbysupplierandsubcategory/${c}/${t}`),"GET");x.value=r.data}catch(r){console.error(r)}finally{f.value=!1}},te=async()=>{if(!d.value.trim()){I.value=[];return}T.value=!0;try{const t=await w(k(`/supplier/misproductos/searchproductsbysupplier/${c}?query=${d.value}`),"GET");I.value=t.data}catch(t){console.error(t)}finally{T.value=!1}},se=async()=>{if(!d.value.trim()){$.value=[];return}A.value=!0;try{const t=await w(k(`/supplier/misproductos/searchproductsbysupplierandcategory/${c}/${i.value}?query=${d.value}`),"GET");$.value=t.data}catch(t){console.error(t)}finally{A.value=!1}},oe=async()=>{if(!b.value.trim()){B.value=[];return}E.value=!0;try{const t=await w(k(`/supplier/misproductos/searchproductsbysupplierandsubcategory/${c}/${p.value}?query=${b.value}`),"GET");B.value=t.data}catch(t){console.error(t)}finally{E.value=!1}},ae=t=>{i.value===t.id?(i.value=null,p.value=null,g.value=[],z()):(i.value=t.id,p.value=null,ee(t.id),G(t.id)),d.value="",b.value="",$.value=[],B.value=[]},le=t=>{p.value===t.id?(p.value=null,G(i.value)):(p.value=t.id,D(t.id)),b.value="",B.value=[]};he(()=>{Z(),z()});const R=l(!1),F=l(!1),H=l(""),O=l(""),U=()=>{R.value=!0},re=()=>{R.value=!1},ne=({message:t,type:r})=>{H.value=t,O.value=r,F.value=!0,setTimeout(()=>{F.value=!1},3e3)},ce=()=>{p.value?D(p.value):i.value?G(i.value):z()},Q=l(!1),ie=()=>{Q.value=!1},ue=t=>{u.value.push(t),console.log("Nueva categoría creada:",t)};return(t,r)=>{const M=xe,q=be,P=ze,V=Ge,de=Re,pe=ke,_e=Ue,me=Se;return s(),a(h,null,[n(de,{class:"max-h-[calc(100vh_-_100px)]"},{default:m(()=>[e("div",qe,[De,e("div",Fe,[(s(!0),a(h,null,S(u.value,o=>(s(),a("div",{key:o.id},[e("div",{onClick:j=>ae(o),class:N([{"text-black":i.value===o.id,"text-gray-600":i.value!==o.id},"flex cursor-pointer items-center justify-start border-t p-2 hover:bg-primary-200"])},[e("div",Oe,[e("div",Qe,[n(M,{name:i.value===o.id?"my-icon:caret-down":"my-icon:caret-right",size:"20"},null,8,["name"])]),e("div",We,[n(M,{name:i.value===o.id?"my-icon:folder-open":"my-icon:folder-close",size:"20"},null,8,["name"])]),e("p",Je,v(o.name),1)])],10,He),n(L(ye),{show:i.value===o.id,as:"template"},{default:m(()=>[n(L(ge),{as:"div",enter:"transition ease-out duration-300 transform","enter-from":"-translate-y-4 opacity-0","enter-to":"translate-y-0 opacity-100",leave:"transition ease-in duration-200 transform","leave-from":"translate-y-0 opacity-100","leave-to":"-translate-y-4 opacity-0"},{default:m(()=>[i.value===o.id?(s(),a("div",Ke,[(s(!0),a(h,null,S(g.value,j=>(s(),a("div",{key:j.id,onClick:Gt=>le(j),class:N([{"bg-primary-500 text-white":p.value===j.id,"text-gray-600 hover:bg-primary-200":p.value!==j.id},"cursor-pointer border-t p-2 text-gray-400"])},[e("div",Ye,[n(M,{name:"my-icon:circles-four",size:"20"}),e("p",Ze,v(j.name),1)])],10,Xe))),128))])):C("",!0)]),_:2},1024)]),_:2},1032,["show"])]))),128))])]),e("div",{class:N(["hidden h-full overflow-auto rounded-lg md:block",t.showMenu?"col-span-2 md:col-span-4 xl:col-span-6":"col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-8"])},[i.value?C("",!0):(s(),a("div",et,[f.value?(s(),a("div",tt,ot)):(s(),a("div",at,[e("div",lt,[rt,e("button",{onClick:U,class:"relative flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-100"},[n(M,{name:"my-icon:plus",size:"20",class:"ml-2"}),nt])]),n(q,{id:"defaultSearch",type:"text",modelValue:d.value,"onUpdate:modelValue":r[0]||(r[0]=o=>d.value=o),onInput:te,placeholder:"Buscar productos..."},null,8,["modelValue"]),T.value?(s(),a("div",ct,ut)):(s(),y(V,{key:1},{default:m(()=>[(s(!0),a(h,null,S(I.value,o=>(s(),y(P,{key:o.supplier_product_id,product:o},null,8,["product"]))),128)),!I.value.length&&d.value.trim()?(s(),a("p",dt,'No se encontraron resultados para "'+v(d.value)+'"',1)):C("",!0)]),_:1})),pt,n(V,null,{default:m(()=>[(s(!0),a(h,null,S(x.value,o=>(s(),y(P,{key:o.supplier_product_id,product:o},null,8,["product"]))),128))]),_:1})]))])),i.value&&!p.value?(s(),a("div",_t,[f.value?(s(),a("div",mt,ft)):(s(),a("div",ht,[e("div",yt,[gt,e("button",{onClick:U,class:"relative flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-100"},[n(M,{name:"my-icon:plus",size:"20",class:"ml-2"}),xt])]),n(q,{id:"categorySearch",type:"text",modelValue:d.value,"onUpdate:modelValue":r[1]||(r[1]=o=>d.value=o),onInput:se,placeholder:"Buscar productos..."},null,8,["modelValue"]),A.value?(s(),a("div",bt,kt)):(s(),y(V,{key:1},{default:m(()=>[(s(!0),a(h,null,S($.value,o=>(s(),y(P,{key:o.supplier_product_id,product:o},null,8,["product"]))),128)),!$.value.length&&d.value.trim()?(s(),a("p",St,'No se encontraron resultados para "'+v(d.value)+'"',1)):C("",!0)]),_:1})),Ct,n(V,null,{default:m(()=>[(s(!0),a(h,null,S(x.value,o=>(s(),y(P,{key:o.supplier_product_id,product:o},null,8,["product"]))),128))]),_:1})]))])):C("",!0),p.value?(s(),a("div",$t,[f.value?(s(),a("div",Bt,Pt)):(s(),a("div",Vt,[e("div",jt,[Nt,e("button",{onClick:U,class:"relative flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-100"},[n(M,{name:"my-icon:plus",size:"20",class:"ml-2"}),It])]),n(q,{id:"subcategorySearch",type:"text",modelValue:b.value,"onUpdate:modelValue":r[2]||(r[2]=o=>b.value=o),onInput:oe,placeholder:"Buscar productos..."},null,8,["modelValue"]),E.value?(s(),a("div",Lt,At)):(s(),y(V,{key:1},{default:m(()=>[(s(!0),a(h,null,S(B.value,o=>(s(),y(P,{key:o.supplier_product_id,product:o},null,8,["product"]))),128)),!B.value.length&&b.value.trim()?(s(),a("p",Et,'No se encontraron resultados para "'+v(b.value)+'"',1)):C("",!0)]),_:1})),zt,n(V,null,{default:m(()=>[(s(!0),a(h,null,S(x.value,o=>(s(),y(P,{key:o.supplier_product_id,product:o},null,8,["product"]))),128))]),_:1})]))])):C("",!0)],2)]),_:1}),n(pe,{showModal:R.value,closeModal:re,categoryId:i.value,subcategoryId:p.value,onNotify:ne,onProductAdded:ce},null,8,["showModal","categoryId","subcategoryId"]),n(_e,{message:H.value,type:O.value},null,8,["message","type"]),n(me,{showModal:Q.value,closeModal:ie,onCategoryCreated:ue},null,8,["showModal"])],64)}}};export{Ft as default};
