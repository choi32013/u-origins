import ClientApp from '../components/ClientApp';
import koreaHistory from '../data/korea-history';
import romeHistory from '../data/rome-history';

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ClientApp datasets={[koreaHistory, romeHistory]} />
    </div>
  );
}
