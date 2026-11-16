const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');
function setup(enabled,failCopy=false,failTag=false){
 const events=[],elements={};
 function el(){return {value:'',dataset:{},classList:{add(){},remove(){}},select(){},handlers:{},addEventListener(n,f){this.handlers[n]=f;}};}
 for(const id of ['cnpjInput','generateBtn','copyBtn','validateInput','validateBtn','validationResult','toast']) elements[id]=el();
 const links=['topbar','footer'].map(p=>{const e=el();e.dataset.linkPosition=p;return e;});
 const ctx={document:{getElementById:id=>elements[id],querySelectorAll:()=>links},navigator:{clipboard:{async writeText(){if(failCopy)throw Error('denied');}}},setTimeout(){},CNPJ_ANALYTICS_ENABLED:enabled,gtag(...args){if(failTag)throw Error('offline');events.push(args);}};
 ctx.window=ctx;vm.runInNewContext(source,ctx);return {events,elements,links};
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
