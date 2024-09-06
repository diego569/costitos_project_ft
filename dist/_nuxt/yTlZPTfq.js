import{_ as h}from"./O2bfNkhH.js";import{o,c as n,n as m,b as u,w as _,a as e,y as i,W as l,t as a,F as p}from"./0G305dhd.js";const f={class:"relative aspect-square overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700"},w=["src","onLoad"],x={class:"flex h-full w-full animate-pulse items-center justify-center bg-gray-200"},y=e("svg",{class:"h-5 w-5 animate-spin text-gray-500",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},[e("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"}),e("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C6.48 0 2 4.48 2 10h2zm2 5.29l-1.42-1.42C6.6 14.09 7 12.6 7 11H5c0 1.76-.55 3.4-1.49 4.71L6 17.29z"})],-1),v=[y],b={class:"p-2 sm:p-3"},k={class:"mb-2 flex items-center justify-between"},L={class:"line-clamp-2 font-sans text-sm font-medium leading-relaxed text-gray-900 antialiased"},C={class:"line-clamp-2 font-sans text-xs font-normal leading-normal text-gray-700 antialiased opacity-75 sm:line-clamp-3"},j={class:"flex w-full"},B=["onClick"],$={__name:"ProductCard",props:{products:{type:Array,required:!0},updatePrice:Function},emits:["agregar"],setup(r,{emit:F}){const c=s=>{s.isLoading=!1};return(s,M)=>{const d=h;return o(!0),n(p,null,m(r.products,t=>(o(),n("div",{key:t.id,class:"relative flex flex-col justify-between rounded-xl bg-white bg-clip-border p-2 text-gray-700 transition-all duration-200 hover:shadow-md"},[u(d,{to:{name:"catalogo-producto-slug",params:{slug:t.slug}},class:"pointer"},{default:_(()=>[e("div",f,[i(e("img",{src:t.photo,onLoad:g=>c(t),alt:"card-image",class:"h-full w-full object-cover object-center"},null,40,w),[[l,!t.isLoading]]),i(e("div",x,v,512),[[l,t.isLoading]])]),e("div",b,[e("div",k,[e("p",L,a(t.name)+" - "+a(t.unitOfMeasure),1)]),e("p",C,a(t.description),1)])]),_:2},1032,["to"]),e("div",j,[e("button",{class:"block w-full select-none rounded-lg bg-gray-900/10 px-5 py-3 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 shadow-none shadow-gray-900/10 transition-all hover:scale-105 hover:shadow-none hover:shadow-gray-900/20 focus:scale-105 focus:opacity-[0.85] focus:shadow-none active:scale-100 active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",type:"button",onClick:g=>s.$emit("agregar",t,t.selectedMeasure)}," Agregar ",8,B)])]))),128)}}};export{$ as _};
