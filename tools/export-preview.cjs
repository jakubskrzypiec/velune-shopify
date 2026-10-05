// GitHub Pages preview generated from the same Liquid sections as the theme.
const fs=require('fs'),path=require('path');
const {render}=require('./preview.cjs');
const root=path.resolve(__dirname,'..');
const base='/velune-shopify';
const routes=['/','/collections/all','/products/apple-crumble','/products/cinnamon','/products/pumpkin-spice-latte','/cart','/pages/dostawa','/pages/zwroty','/pages/kontakt','/password'];
(async()=>{
  for(const route of routes){
    let html=await render(route);
    html=html.replace(/((?:href|src|action|data-image)=["'])\/(?!\/)([^"']*)/g,(_,attribute,url)=>{
      const [pathname,hash]=url.split('#');
      const trailing=pathname&&!pathname.startsWith('assets/')&&!pathname.endsWith('/')?'/':'';
      return attribute+base+'/'+pathname+trailing+(hash?'#'+hash:'');
    }).replace(/http:\/\/localhost:4173/g,'https://jakubskrzypiec.github.io'+base);
    const target=path.join(root,route==='/'?'index.html':route.slice(1)+'/index.html');
    fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);
  }
  fs.writeFileSync(path.join(root,'.nojekyll'),'');
  console.log('Exported '+routes.length+' GitHub Pages preview routes.');
})().catch(error=>{console.error(error);process.exitCode=1;});
