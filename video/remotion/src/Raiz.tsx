import React from 'react';
import { Composition } from 'remotion';
import { Pitch } from './Pitch';
import { ALTURA, DURACAO_TOTAL, FPS, LARGURA } from './roteiro';

export const Raiz: React.FC = () => (
  <Composition id="Pitch" component={Pitch} durationInFrames={DURACAO_TOTAL} fps={FPS} width={LARGURA} height={ALTURA} defaultProps={{ legenda: true }} />
);
