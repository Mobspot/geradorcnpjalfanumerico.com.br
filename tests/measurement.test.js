const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');
const analytics=fs.readFileSync(path.join(__dirname,'../analytics-config.js'),'utf8');
function setup(enabled,failCopy=false,failTag=false,measurementId){
 const events=[],elements={},scripts=[];
 function el(){return {value:'',dataset:{},classList:{add(){},remove(){}},select(){},handlers:{},addEventListener(n,f){this.handlers[n]=f;}};}
 for(const id of ['cnpjInput','generateBtn','copyBtn','validateInput','validateBtn','validationResult','toast']) elements[id]=el();
 elements['analytics-privacy']={hidden:true};
 const links=['topbar','footer'].map(p=>{const e=el();e.dataset.linkPosition=p;return e;});
 const ctx={document:{getElementById:id=>elements[id],querySelectorAll:()=>links,createElement:tag=>{assert.equal(tag,'script');return {};},head:{appendChild:script=>scripts.push(script)}},navigator:{clipboard:{async writeText(){if(failCopy)throw Error('denied');}}},setTimeout(){},CNPJ_ANALYTICS_ENABLED:enabled,gtag(...args){if(failTag)throw Error('offline');events.push(args);}};
 ctx.window=ctx;
 if(measurementId!==undefined){
  delete ctx.gtag;
  vm.runInNewContext(analytics.replace('const GA4_MEASUREMENT_ID = "";',`const GA4_MEASUREMENT_ID = ${JSON.stringify(measurementId)};`),ctx);
 }
 vm.runInNewContext(source,ctx);return {events,elements,links,ctx,scripts};
}
test('tracking disabled and initial generation stay silent',async()=>{
 const s=setup(false);assert.equal(s.events.length,0);s.elements.generateBtn.handlers.click();s.elements.validateBtn.handlers.click();await s.elements.copyBtn.handlers.click();s.links[0].handlers.click();assert.equal(s.events.length,0);
});
test('actions emit only aggregate allowlisted data',async()=>{
 const s=setup(true);assert.equal(s.events.length,0);s.elements.generateBtn.handlers.click();s.elements.validateInput.value='PRIVATE INPUT';s.elements.validateBtn.handlers.click();s.elements.validateInput.value=s.elements.cnpjInput.value;s.elements.validateInput.handlers.keydown({key:'Enter'});await s.elements.copyBtn.handlers.click();s.links.forEach(l=>l.handlers.click());
 assert.deepEqual(JSON.parse(JSON.stringify(s.events)),[['event','generate_cnpj',{}],['event','validate_cnpj',{valid:false}],['event','validate_cnpj',{valid:true}],['event','copy_cnpj',{}],['event','click_mobspot',{link_position:'topbar'}],['event','click_mobspot',{link_position:'footer'}]]);
 assert.ok(!JSON.stringify(s.events).includes(s.elements.cnpjInput.value));
});
test('clipboard failure does not count success',async()=>{const s=setup(true,true);await s.elements.copyBtn.handlers.click();assert.equal(s.events.length,0);});
test('collector failure does not break tool',()=>{const s=setup(true,false,true);assert.doesNotThrow(()=>s.elements.generateBtn.handlers.click());assert.doesNotThrow(()=>s.elements.validateBtn.handlers.click());});

async function useTool(s){
 s.elements.generateBtn.handlers.click();
 s.elements.validateInput.value='PRIVATE INPUT';
 s.elements.validateBtn.handlers.click();
 await s.elements.copyBtn.handlers.click();
 s.links.forEach(link=>link.handlers.click());
}

test('empty or invalid configuration creates no external script, collector or queue',async()=>{
 for(const id of ['', 'G-invalid', 'G-', 'G-ABC&extra=private']){
  const s=setup(true,false,false,id);
  await useTool(s);
  assert.equal(s.ctx.CNPJ_ANALYTICS_ENABLED,false);
  assert.equal(s.scripts.length,0);
  assert.equal(s.ctx.gtag,undefined);
  assert.equal(s.ctx.dataLayer,undefined);
  assert.equal(s.elements['analytics-privacy'].hidden,true);
 }
});

test('configured bootstrap loads official gtag and queues all four events without input',async()=>{
 const s=setup(false,false,false,'G-TEST123');
 assert.equal(s.ctx.CNPJ_ANALYTICS_ENABLED,true);
 assert.equal(s.scripts.length,1);
 assert.equal(s.scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=G-TEST123');
 assert.equal(s.scripts[0].async,true);
 assert.equal(s.scripts[0].referrerPolicy,'no-referrer');
 assert.equal(s.elements['analytics-privacy'].hidden,false);
 const commands=()=>JSON.parse(JSON.stringify(Array.from(s.ctx.dataLayer,args=>Array.from(args))));
 assert.deepEqual(commands()[0],['consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'}]);
 assert.deepEqual(commands()[2],['config','G-TEST123',{
  anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false,
  page_location:'https://geradorcnpjalfanumerico.com.br/',page_referrer:''
 }]);
 assert.equal(commands().filter(c=>c[0]==='event').length,0);
 await useTool(s);
 assert.deepEqual(commands().filter(c=>c[0]==='event'),[
  ['event','generate_cnpj',{}],['event','validate_cnpj',{valid:false}],
  ['event','copy_cnpj',{}],['event','click_mobspot',{link_position:'topbar'}],
  ['event','click_mobspot',{link_position:'footer'}]
 ]);
 assert.ok(!JSON.stringify(commands()).includes('PRIVATE INPUT'));
 assert.ok(!JSON.stringify(commands()).includes(s.elements.cnpjInput.value));
 // Simula o coletor já carregado consumindo chamadas, além da fila inicial.
 s.ctx.gtag=(...args)=>s.events.push(args);
 await useTool(s);
 assert.deepEqual(s.events.map(event=>event[1]),['generate_cnpj','validate_cnpj','copy_cnpj','click_mobspot','click_mobspot']);
});

test('blocked gtag disables collection while the tool remains functional',async()=>{
 const s=setup(false,false,false,'G-TEST123');
 s.scripts[0].onerror();
 await useTool(s);
 assert.equal(s.ctx.CNPJ_ANALYTICS_ENABLED,false);
 assert.equal(s.ctx.dataLayer.length,0);
 assert.ok(s.elements.cnpjInput.value);
});
