import { normalizePath } from 'vite'
import fs from 'fs';
import path from 'path';

export default function nodeTOString() {
  const virtualModuleId = '@rpa-node-to-text'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'nodeTOString', // 必须的，将会在 warning 和 error 中显示
    buildStart() {
      nodeTOText();
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) { }
    },
    async handleHotUpdate(ctx: any) {
      let resultFile = path.resolve(__dirname, "./node/index.ts");
      if (resultFile === ctx.file) return;
      nodeTOText();
    }
  }
}

function nodeTOText() {
  let dir = path.resolve(__dirname, "./node/script");
  let resultDir = path.resolve(__dirname, "./node/");
  let res = fs.readdirSync(dir);
  let temp = {};
  for (const item of res) {
    let key = item.slice(0, item.indexOf("."));
    let res = fs.readFileSync(`${dir}/${item}`);
    temp[key] = res.toString()
  }
  let str = ``
  for (const key in temp) {
    str += `export const ${key} = \`${temp[key]};\`\r\n`;
  }
  fs.writeFileSync(`${resultDir}/index.ts`, str);
}