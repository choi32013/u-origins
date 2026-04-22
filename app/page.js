import ClientApp from '../components/ClientApp';
import koreaHistory from '../data/korea-history';

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ClientApp dataset={koreaHistory} />
    </div>
  );
}
