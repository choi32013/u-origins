'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const MainPrototype = dynamic(() => import('./MainPrototype'), { ssr: false });

export default function ClientApp({ datasets }) {
  const [activeId, setActiveId] = useState(datasets[0].id);
  const dataset = datasets.find(d => d.id === activeId) ?? datasets[0];

  return <MainPrototype dataset={dataset} datasets={datasets} activeId={activeId} setActiveId={setActiveId} />;
}
