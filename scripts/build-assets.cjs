/* Exact vector artwork and PNG exports. Requires development dependency sharp. */
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const root = path.resolve(__dirname, "..");
const red = "#FF0033";
const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${inner}</svg>`;
const bubble = (d, fill = "#FFFFFF", width = 22, edge = "#000000") => `<path data-role="bubble" d="${d}" fill="${fill}" stroke="${edge}" stroke-width="${width}" stroke-linejoin="round"/>`;
const lines = (x, y, widths, gap, color, width) => widths.map((length, i) => `<path data-role="comment-line" d="M${x} ${y + i * gap}h${length}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`).join("");
const ban = (x, y, radius, width) => {
  const end = +(radius * Math.SQRT1_2).toFixed(3);
  return `<g data-role="prohibition" fill="none" stroke="${red}" stroke-width="${Math.round(width * 1.35)}" stroke-linecap="round"><circle cx="${x}" cy="${y}" r="${radius}"/><path d="M${x-end} ${y-end}L${x+end} ${y+end}"/></g>`;
};
const candidates = [
  { id: "01", name: "Classic outline", body: bubble("M120 118H354Q402 118 402 166V326Q402 374 354 374H188L112 434V374Q62 374 62 324V168Q62 118 120 118Z") + lines(119, 186, [210, 160, 110], 55, "#000000", 20) + ban(367, 130, 86, 25) },
  { id: "02", name: "Solid / corner badge", body: bubble("M130 92H358Q414 92 414 148V316Q414 372 358 372H188L110 430V372Q58 372 58 316V148Q58 92 130 92Z", "#000000", 12, "#FFFFFF") + lines(118, 164, [220, 174, 122], 55, "#FFFFFF", 23) + ban(378, 356, 85, 26) },
  { id: "03", name: "Wide / upper badge", body: bubble("M98 136H362Q422 136 422 196V292Q422 352 362 352H188L118 410V352H98Q38 352 38 292V196Q38 136 98 136Z", "#FFFFFF", 20) + lines(94, 194, [166, 232, 122], 50, "#000000", 18) + ban(393, 123, 77, 23) },
  { id: "04", name: "Centered prohibition", body: bubble("M146 108H366Q410 108 410 152V322Q410 366 366 366H332V424L260 366H146Q102 366 102 322V152Q102 108 146 108Z", "#000000", 10, "#FFFFFF") + lines(152, 178, [202, 151, 104], 57, "#FFFFFF", 22) + ban(256, 248, 184, 25) },
  { id: "05", name: "Soft round / lower badge", body: bubble("M172 80H330Q430 80 430 180V272Q430 372 330 372H218L140 430V366Q70 348 70 272V180Q70 80 172 80Z", "#FFFFFF", 23) + lines(139, 162, [211, 165, 113], 54, "#000000", 21) + ban(382, 350, 84, 24) }
];
async function fitIcon(source, size) {
  const bitmap = await sharp(Buffer.from(source), { density: 192 }).png().toBuffer();
  const artwork = await sharp(bitmap).trim({ threshold: 0 }).png().toBuffer();
  const extent = Math.round(size * (size >= 128 ? .75 : .91));
  const content = await sharp(artwork).resize(extent, extent, { fit: "inside" }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: "#00000000" } }).composite([{ input: content, gravity: "centre" }]).png().toBuffer();
}
async function main() {
  const branding = path.join(root, "assets/branding");
  const store = path.join(root, "assets/store");
  await fs.mkdir(path.join(branding, "candidates"), { recursive: true });
  await fs.mkdir(path.join(store, "screenshots"), { recursive: true });
  await fs.mkdir(path.join(store, "promotional"), { recursive: true });
  for (const item of candidates) {
    const split = item.body.indexOf('<g data-role="prohibition"');
    const source = svg(`<g data-role="comment" transform="translate(25.6 25.6) scale(0.9)">${item.body.slice(0,split)}</g>${item.body.slice(split)}`);
    const dest = path.join(branding, "candidates", `candidate-${item.id}`);
    await fs.mkdir(dest, { recursive: true });
    await fs.writeFile(path.join(dest, "icon.svg"), source + "\n");
    for (const size of [16, 32, 48, 128, 256, 512, 1024]) await fs.writeFile(path.join(dest, `icon-${size}.png`), await fitIcon(source, size));
  }
  const selected = process.argv[2] || "01";
  if (!candidates.some(item => item.id === selected)) throw new Error("Choose candidate 01, 02, 03, 04 or 05");
  await fs.copyFile(path.join(branding, "candidates", `candidate-${selected}`, "icon.svg"), path.join(branding, "selected.svg"));
  for (const size of [16, 32, 48, 128]) await fs.copyFile(path.join(branding, "candidates", `candidate-${selected}`, `icon-${size}.png`), path.join(root, "extension/icons", `icon${size}.png`));
  await fs.copyFile(path.join(root, "extension/icons/icon128.png"), path.join(store, "store-icon-128.png"));
  const selection = { selected, provisional: true, bubbleScale: .9, prohibitionStrokeMultiplier: 1.35, palette: ["#000000", "#FFFFFF", red], method: "SVG geometry; no image generation model", candidates: candidates.map(({id, name}) => ({id, name})), constraints: ["transparent outside the speech bubble", "three unequal horizontal comment lines", "upright", "no shadows", "no gradients", "red circle with diagonal prohibition bar"] };
  await fs.writeFile(path.join(branding, "selection.json"), JSON.stringify(selection, null, 2) + "\n");
  const entries = [];
  for (const [i, item] of candidates.entries()) {
    entries.push({ input: await fs.readFile(path.join(branding, "candidates", `candidate-${item.id}`, "icon-256.png")), left: i * 300 + 22, top: 14 });
    const label = `<svg width="300" height="60"><text x="150" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="${red}">${item.id}</text></svg>`;
    entries.push({ input: Buffer.from(label), left: i * 300, top: 274 });
  }
  await sharp({create:{width:1500,height:344,channels:4,background:"#00000000"}}).composite(entries).png().toFile(path.join(branding,"candidates-comparison.png"));
  const mark = await sharp(path.join(branding, "selected.svg")).resize(260,260).png().toBuffer();
  await sharp({create:{width:440,height:280,channels:3,background:"#000000"}}).composite([{input:mark,left:90,top:10}]).removeAlpha().png().toFile(path.join(store,"promotional/small-440x280.png"));
  const markWide = await sharp(path.join(branding, "selected.svg")).resize(460,460).png().toBuffer();
  const message = `<svg width="850" height="560"><style>text{font-family:'Noto Sans CJK KR',sans-serif;fill:#FFFFFF}</style><text x="80" y="126" font-size="20" letter-spacing="3">YOUTUBE COMMENT BLOCK</text><text x="80" y="260" font-size="76" font-weight="700">영상 먼저.</text><text x="80" y="360" font-size="76" font-weight="700">내 생각 먼저.</text><text x="82" y="449" font-size="25">댓글은 내가 원할 때만.</text></svg>`;
  await sharp({create:{width:1400,height:560,channels:3,background:"#000000"}}).composite([{input:Buffer.from(message),left:0,top:0},{input:markWide,left:880,top:50}]).removeAlpha().png().toFile(path.join(store,"promotional/marquee-1400x560.png"));
  console.log(`Generated 5 candidates, PNG sizes 16–1024, comparison, selected candidate ${selected}, store icon and two promo tiles.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
