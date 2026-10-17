const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const root = path.resolve(__dirname,"..");
async function png(relative, width, height, alpha) {
  const data = await fs.readFile(path.join(root,relative));
  const metadata = await sharp(data).metadata();
  assert.equal(metadata.format,"png",relative);
  assert.equal(metadata.width,width,relative);
  assert.equal(metadata.height,height,relative);
  assert.equal(metadata.hasAlpha,alpha,relative);
  if (alpha) {
    const {data:pixels,info} = await sharp(data).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for (const index of [0,width-1,(height-1)*width,height*width-1]) assert.equal(pixels[index*info.channels+3],0,relative + " transparent corner");
    assert.ok(pixels.some((value,index)=>index%4===3 && value===255),relative + " nonempty artwork");
    if (width===128) {
      for (let y=0;y<height;y++) for (let x=0;x<width;x++) if (x<16 || x>=112 || y<16 || y>=112) assert.equal(pixels[(y*width+x)*4+3],0,relative+" transparent padding");
    }
  }
}
async function main() {
  for (let index=1;index<=5;index++) {
    const id=String(index).padStart(2,"0");
    const base=`assets/branding/candidates/candidate-${id}`;
    const source=await fs.readFile(path.join(root,base,"icon.svg"),"utf8");
    assert.equal((source.match(/data-role="comment-line"/g)||[]).length,3,base);
    const widths=[...source.matchAll(/data-role="comment-line" d="M[\d.]+ [\d.]+h([\d.]+)"/g)].map(match=>match[1]);
    assert.equal(new Set(widths).size,3,base+" unequal lines");
    assert.equal((source.match(/data-role="prohibition"/g)||[]).length,1,base);
    assert.ok(!/filter|shadow|gradient|rotate|skew|<rect/i.test(source),base+" no background, perspective or effects");
    for (const color of source.match(/#[0-9a-f]{6}/gi)||[]) assert.ok(["#000000","#FFFFFF","#FF0033"].includes(color.toUpperCase()),base+" palette");
    for (const size of [16,32,48,128,256,512,1024]) await png(`${base}/icon-${size}.png`,size,size,true);
  }
  for (const size of [16,32,48,128]) await png(`extension/icons/icon${size}.png`,size,size,true);
  const selection=JSON.parse(await fs.readFile(path.join(root,"assets/branding/selection.json")));
  for (const size of [16,32,48,128]) {
    const chosen=await fs.readFile(path.join(root,`assets/branding/candidates/candidate-${selection.selected}/icon-${size}.png`));
    const installed=await fs.readFile(path.join(root,`extension/icons/icon${size}.png`));
    assert.ok(chosen.equals(installed),`Installed ${size}px icon matches selected candidate`);
  }
  assert.ok((await fs.readFile(path.join(root,"assets/store/store-icon-128.png"))).equals(await fs.readFile(path.join(root,"extension/icons/icon128.png"))),"Store icon matches installed icon");
  await png("assets/store/store-icon-128.png",128,128,true);
  await png("assets/store/promotional/small-440x280.png",440,280,false);
  await png("assets/store/promotional/marquee-1400x560.png",1400,560,false);
  for (const name of ["01-choice-light","02-research-source","03-focus","04-comments-open","05-choice-dark"]) await png(`assets/store/screenshots/${name}.png`,1280,800,false);
  await png("assets/store/screenshots/en/01-choice-light.png",1280,800,false);
  const manifest=JSON.parse(await fs.readFile(path.join(root,"extension/manifest.json")));
  assert.equal(manifest.default_locale,"ko");
  for (const locale of ["ko","en"]) {
    const messages=JSON.parse(await fs.readFile(path.join(root,`extension/_locales/${locale}/messages.json`)));
    assert.ok(messages.extensionName.message.length<=45,locale+" name length");
    assert.ok(messages.extensionDescription.message.length<=132,locale+" description length");
  }
  console.log("Verified 5 vector candidates, 35 PNG exports, installed icons, transparent padding, store image dimensions/formats, and localized metadata lengths.");
}
main().catch(error=>{console.error(error);process.exitCode=1});
