import { Config } from '@remotion/cli/config';
import { existsSync } from 'node:fs';

Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setChromiumOpenGlRenderer('angle');
// Na nuvem do Claude Code o Chromium já vem instalado; no computador da dupla o Remotion baixa o dele.
const chrome = process.env.REMOTION_CHROME ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (existsSync(chrome)) Config.setBrowserExecutable(chrome);
