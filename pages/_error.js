function Error({ statusCode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#1a1815' }}>{statusCode}</h1>
        <p style={{ color: '#8a8578' }}>
          {statusCode === 404 ? '페이지를 찾을 수 없습니다' : '서버 오류가 발생했습니다'}
        </p>
        <a href="/" style={{ color: '#c25b3f' }}>홈으로 돌아가기</a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
