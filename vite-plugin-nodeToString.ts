import { normalizePath } from 'vite'
import fs from 'fs';
import path from 'path';
import { throttle } from "lodash";
let watcher = null;

export default function nodeTOString() {
  const virtualModuleId = '@rpa-node-to-text'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'nodeTOString', // 必须的，将会在 warning 和 error 中显示
    buildStart(options) {
      watchFile();
      nodeTOText();
    },
    closeBundle() {
      watcher?.close();
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
      let dir = path.resolve(__dirname, "./node/script");
      //文件生成，只是包含./node/script目录下的文件修改
      if (ctx.file.indexOf(dir) === 0) {
        nodeTOText();
      }
    }
  }
}

function nodeTOText() {
  let dir = path.resolve(__dirname, "./node/script");
  let resultDir = path.resolve(__dirname, "./node/");
  let res = fs.readdirSync(dir);
  let temp = {};
  for (const item of res) {
    //过滤隐藏文件
    if (item.indexOf(".") === 0) continue;
    let key = item.slice(0, item.indexOf("."));
    let res = fs.readFileSync(`${dir}/${item}`);
    temp[key] = res.toString()
  }
  let templateJSON = JSON.stringify(temp);
  let str = `const templateJSON = ${templateJSON};\r\n`
  for (const key in temp) {
    str += `export const ${key} = templateJSON.${key};\r\n`;
  }
  fs.writeFileSync(`${resultDir}/index.ts`, str);
}

function watchFile() {
  let dirPath = path.resolve(__dirname, "./node/script");
  if (watcher) watcher.close();
  watcher = fs.watch(
    dirPath,
    {
      encoding: "utf-8",
    },
    (eventType, filename) => {
      nodeTOText();
    }
  );
}