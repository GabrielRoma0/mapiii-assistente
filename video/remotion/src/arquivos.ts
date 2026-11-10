// Lista dos arquivos de public/, gravada por scripts/preparar.mjs. Serve para usar a gravação só quando ela existe.
import lista from './gerado-arquivos.json';

const ARQUIVOS = new Set(lista as string[]);
export const arquivoExiste = (caminho: string) => ARQUIVOS.has(caminho);
