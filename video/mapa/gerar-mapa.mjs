import fs from 'fs';
const [,, tc, entrada, saida] = process.argv;
const { feature } = await import(tc);
const topo = JSON.parse(fs.readFileSync(entrada, 'utf8'));
const land = feature(topo, topo.objects.land);
const W = 1920, H = 960, N = 84, S = -60; // equiretangular, sem a Antártida
const px = ([lon, lat]) => [((lon + 180) / 360) * W, ((N - lat) / (N - S)) * H];
let d = '';
for (const g of land.features) {
  const polys = g.geometry.type === 'Polygon' ? [g.geometry.coordinates] : g.geometry.coordinates;
  for (const poly of polys) for (const ring of poly) {
    if (ring.every(([, lat]) => lat < S)) continue;
    // longitudes contínuas (sem salto de 360° na linha de data), desenhado também deslocado ±360°
    const cont = []; let prev = null;
    for (const [lon0, lat] of ring) { let lon = lon0; if (prev !== null) { while (lon - prev > 180) lon -= 360; while (prev - lon > 180) lon += 360; } cont.push([lon, Math.max(lat, S)]); prev = lon; }
    for (const off of [-360, 0, 360]) {
      const pts = cont.map(([lon, lat]) => px([lon + off, lat]));
      if (pts.every(([x]) => x < 0) || pts.every(([x]) => x > W)) continue;
      d += 'M' + pts.map(v => v.map(n => n.toFixed(1)).join(',')).join('L') + 'Z';
    }
  }
}
fs.writeFileSync(saida, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path fill="#9A8C98" d="${d}"/></svg>\n`);
console.log('São Paulo (-46.63, -23.55) →', px([-46.63, -23.55]).map(v => v.toFixed(0)).join(', '));
