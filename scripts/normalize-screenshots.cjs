/* Normalize browser captures to the exact submission format; no UI/content edits. */
const fs=require("node:fs/promises");
const path=require("node:path");
const sharp=require("sharp");
const root=path.resolve(__dirname,"../assets/store/screenshots");
async function main(){
  const records=[];
  for(const name of ["01-choice-light","02-research-source","03-focus","04-comments-open","05-choice-dark","en/01-choice-light"]){
    const file=path.join(root,name+".png");
    const input=await fs.readFile(file);
    const info=await sharp(input).metadata();
    if(Math.abs(info.width/info.height-1.6)>.01) throw new Error("Unexpected capture aspect ratio: "+name);
    const result=await sharp(input).resize(1280,800,{fit:"fill"}).removeAlpha().png().toBuffer();
    await fs.writeFile(file,result);
    records.push({file:name+".png",capturedWidth:info.width,capturedHeight:info.height,outputWidth:1280,outputHeight:800,format:"RGB PNG"});
  }
  const provenance={date:"2026-10-17",source:"http://127.0.0.1:4173/watch?v=example-video",sourceType:"Local fixture running actual extension content scripts, visibly labeled as a sample",captureMethod:"Codex in-app browser screenshot API via cua_repl",viewport:{width:1280,height:800},normalization:"Browser API returned 1265×791 complete-frame captures; resized to exact 1280×800 and converted to opaque RGB PNG. No UI/content was added, removed or retouched.",notEvidenceOf:"An installed extension running on live youtube.com",captures:records};
  await fs.writeFile(path.join(root,"provenance.json"),JSON.stringify(provenance,null,2)+"\n");
  console.log("Normalized 6 browser captures to 1280×800 RGB PNG.");
}
main().catch(error=>{console.error(error);process.exitCode=1});
