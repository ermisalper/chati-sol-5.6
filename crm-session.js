(function(global){
  "use strict";
  var VERSION=1, ACTIVE="combinvest.crm.activeCustomer.v1", PREFIX="combinvest.crm.customer.";
  var params=new URLSearchParams(location.search);
  var customerId=(params.get("customerId")||params.get("cid")||"").trim();
  if(!customerId){try{customerId=sessionStorage.getItem(ACTIVE)||"";}catch(e){}}
  if(!customerId) customerId="local-demo";
  try{sessionStorage.setItem(ACTIVE,customerId);}catch(e){}
  function safeId(v){return String(v).replace(/[^a-zA-Z0-9_-]/g,"_").slice(0,80)||"local-demo";}
  customerId=safeId(customerId);
  function storageKey(module){return PREFIX+customerId+"."+safeId(module)+".v"+VERSION;}
  function load(module,fallback){
    try{var raw=localStorage.getItem(storageKey(module));return raw?JSON.parse(raw):fallback;}catch(e){return fallback;}
  }
  function save(module,data){
    var record={customerId:customerId,module:module,updatedAt:new Date().toISOString(),data:data};
    try{localStorage.setItem(storageKey(module),JSON.stringify(record));}catch(e){return false;}
    return true;
  }
  function data(module,fallback){var r=load(module,null);return r&&r.data!=null?r.data:fallback;}
  function url(target,extra){
    var u=new URL(target,location.href);if(u.origin!==location.origin)return target;
    u.searchParams.set("customerId",customerId);
    Object.keys(extra||{}).forEach(function(k){if(extra[k]!=null)u.searchParams.set(k,extra[k]);});
    return u.pathname.split("/").pop()+u.search+u.hash;
  }
  function propagateLinks(){
    document.querySelectorAll('a[href]').forEach(function(a){
      var raw=a.getAttribute("href");if(!raw||raw[0]==="#"||/^(mailto:|tel:|javascript:)/i.test(raw))return;
      try{var u=new URL(raw,location.href);if(u.origin===location.origin&&/\.html$/i.test(u.pathname)){u.searchParams.set("customerId",customerId);a.href=u.pathname.split("/").pop()+u.search+u.hash;}}catch(e){}
    });
  }
  global.CombinvestCRM={customerId:customerId,storageKey:storageKey,load:load,data:data,save:save,url:url,propagateLinks:propagateLinks};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",propagateLinks);else propagateLinks();
})(window);
