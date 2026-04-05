export default function Loading() {
  return (
    <div className="loading-screen">
      <img
        src="/assets/img/Ajwa/logo-ajwa.png"
        alt="FlyAjwa"
        style={{
          height: 60,
          width: 'auto',
          background: 'white',
          borderRadius: 12,
          padding: '6px 14px',
        }}
      />
      <div className="loading-spinner" />
    </div>
  );
}
