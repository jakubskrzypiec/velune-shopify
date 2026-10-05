const fs=require('fs'),path=require('path'),http=require('http');
const {Liquid}=require('liquidjs');
const root=path.resolve(__dirname,'..');
const engine=new Liquid({root:path.join(root,'snippets'),extname:'.liquid',strictFilters:false,globals:{settings:{preview_mode:true,preview_price:50,preview_regular_price:75}}});
engine.registerFilter('asset_url',x=>'/assets/'+x);
engine.registerFilter('stylesheet_tag',x=>'<link rel="stylesheet" href="'+x+'">');
engine.registerFilter('image_url',(x)=>typeof x==='string'?x:x?.src);
engine.registerFilter('money',x=>(Number(x)/100).toLocaleString('pl-PL',{style:'currency',currency:'PLN'}));
const products=[{handle:'apple-crumble',title:'Apple Crumble',short:'Pieczone jabłka. Złota kruszonka. Domowy wieczór.'},{handle:'cinnamon',title:'Cinnamon',short:'Ciepły cynamon. Korzenny akcent. Chwila dla siebie.'},{handle:'pumpkin-spice-latte',title:'Pumpkin Spice Latte',short:'Dyniowe latte. Jesienne przyprawy. Ulubiony kubek.'}].map(p=>({...p,url:'/products/'+p.handle,description:'',images:[],metafields:{custom:{short_description:{value:p.short}}},available:false,variants:[]}));
const product=products[0];
const global={settings:{preview_mode:true,preview_price:50,preview_regular_price:75},request:{locale:{iso_code:'pl'}},shop:{name:'Velune'},cart:{item_count:0,items:[]},routes:{root_url:'/',all_products_collection_url:'/collections/all',cart_url:'/cart'},content_for_header:'',page_description:'Zapachy inspirowane jesienią i małymi domowymi rytuałami. Poznaj Velune Apple Crumble.'};
function source(file){return fs.readFileSync(path.join(root,file),'utf8').replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g,'').replace(/{%\s*paginate[^%]*%}/g,'').replace(/{%\s*endpaginate\s*%}/g,'').replace(/{%\s*form[^%]*%}/g,'<form>').replace(/{%\s*endform\s*%}/g,'</form>');}
async function section(type,instance={},ctx={}){
const raw=fs.readFileSync(path.join(root,'sections',type+'.liquid'),'utf8');
const schema=JSON.parse(raw.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/)[1]);
const defaults=Object.fromEntries(schema.settings.filter(s=>s.id).map(s=>[s.id,s.default??'']));
const blocks=(instance.block_order||[]).map(id=>({...instance.blocks[id],id,shopify_attributes:''}));
return engine.parseAndRender(source('sections/'+type+'.liquid'),{...global,...ctx,section:{id:type,settings:{...defaults,...instance.settings},blocks}});
}
const pages={dostawa:{title:'Dostawa',content:'<p>Przygotowujemy szczegóły dostawy. Koszty i terminy udostępnimy przed rozpoczęciem sprzedaży.</p>'},zwroty:{title:'Zwroty',content:'<p>Zasady i adres obsługi zwrotów udostępnimy przed premierą sklepu.</p>'},kontakt:{title:'Kontakt',content:'<p>Przygotowujemy kontakt z marką Velune. Dane udostępnimy przed premierą.</p>'}};
async function render(url){let name='404',ctx={};if(url==='/')name='index';else if(url==='/collections/all'){name='collection';ctx.collection={title:'Zapachy do zostania.',description:'',products_count:3,products};}else if(products.some(p=>p.url===url)){name='product';ctx.product=products.find(p=>p.url===url);}else if(url==='/cart')name='cart';else if(pages[url.split('/')[2]]&&url.startsWith('/pages/')){name='page';ctx.page=pages[url.split('/')[2]];}else if(url==='/password')name='password';
const templateFile=name==='product'&&ctx.product.handle!=='apple-crumble'?'product.'+ctx.product.handle:name;const json=JSON.parse(fs.readFileSync(path.join(root,'templates',templateFile+'.json')));let body='';for(const id of json.order){const inst=json.sections[id];body+=await section(inst.type,inst,ctx);}
const header=await section('header'),footer=await section('footer');
let layout=source(name==='password'?'layout/password.liquid':'layout/theme.liquid').replace(/{%\s*sections 'header-group'\s*%}/,header).replace(/{%\s*sections 'footer-group'\s*%}/,footer);
return engine.parseAndRender(layout,{...global,...ctx,content_for_layout:body,template:{name},page_title:name==='product'?ctx.product.title:name==='collection'?'Produkty':'Velune',canonical_url:'http://localhost:4173'+url});}
const server=http.createServer(async(req,res)=>{const pathname=new URL(req.url,'http://localhost').pathname;const url=pathname.length>1?pathname.replace(/\/$/,''):pathname;try{if(url.startsWith('/assets/')){const target=path.resolve(root,'.'+url);if(!target.startsWith(path.join(root,'assets')+path.sep))throw Error('invalid path');const ext=path.extname(target);const types={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png'};res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});fs.createReadStream(target).on('error',()=>res.end()).pipe(res);return;}const html=await render(url);res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);}catch(e){console.error(e);res.writeHead(500,{'Content-Type':'text/plain'});res.end(String(e));}});
if(require.main===module)server.listen(4173,'0.0.0.0',()=>console.log('Velune Liquid preview http://localhost:4173'));
module.exports={render};
