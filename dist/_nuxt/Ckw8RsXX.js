import{_ as x}from"./O2bfNkhH.js";import{r as n,K as d,q as b,o as e,c as t,F as m,n as w,b as k,w as C,a,x as c,t as g}from"./0G305dhd.js";const L={class:"flex aspect-square h-16 w-16 items-center justify-center overflow-hidden rounded-l-md bg-gray-200"},B={key:0,class:"h-full w-full animate-pulse rounded-l-md bg-gray-300"},M=["src"],N={class:"flex size-full items-center p-2"},q={class:"font-sans text-sm font-normal leading-normal text-gray-900 antialiased"},I={key:0,class:"mt-4"},V={class:"select-none font-sans text-sm font-medium"},S={__name:"CategoryCard",props:{items:{type:Array,required:!0},category:{type:Boolean,default:!1},subcategory:{type:Boolean,default:!1}},setup(p){const o=p,i=n(!1),r=n(!1),l=n(!1),_=d(()=>o.subcategory),f=()=>{i.value=!0};b(()=>{l.value=window.innerWidth<=768});const y=d(()=>{const u=l.value?6:15;return r.value?o.items:o.items.slice(0,u)}),h=()=>{r.value=!r.value};return(u,j)=>{const v=x;return e(),t(m,null,[(e(!0),t(m,null,w(y.value,s=>(e(),t("div",{key:s.slug},[k(v,{to:{name:_.value?"explorar-subcategoria-slug":"explorar-categoria-slug",params:{slug:s.slug}},class:"flex h-16 cursor-pointer items-center rounded-xl border border-gray-200 bg-white bg-clip-border text-gray-700 transition-all duration-300 hover:shadow-md"},{default:C(()=>[a("div",L,[i.value?c("",!0):(e(),t("div",B)),s.photo?(e(),t("img",{key:1,src:s.photo,alt:"category-image",class:"object-cover",onLoad:f},null,40,M)):c("",!0)]),a("div",N,[a("p",q,g(s.name),1)])]),_:2},1032,["to"])]))),128)),o.items.length>(l.value.value?6:15)?(e(),t("div",I,[a("button",{onClick:h,class:"text-primary-600 hover:text-primary-800"},[a("p",V,g(r.value.value?"Mostrar menos":"Mostrar todos"),1)])])):c("",!0)],64)}}};export{S as _};
