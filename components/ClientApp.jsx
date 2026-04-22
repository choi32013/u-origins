'use client';

import dynamic from 'next/dynamic';

const MainPrototype = dynamic(() => import('./MainPrototype'), { ssr: false });

export default function ClientApp({ dataset }) {
  return <MainPrototype dataset={dataset} />;
}
