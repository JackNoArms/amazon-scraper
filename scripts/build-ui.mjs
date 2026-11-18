import {cp,copyFile,mkdir,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const output=join(root,'dist');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await copyFile(join(root,'frontend','index.html'),join(output,'index.html'));
await cp(join(root,'frontend','src'),join(output,'src'),{recursive:true});
console.log('Interface web pronta em dist/.');
