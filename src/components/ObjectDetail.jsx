export default function ObjectDetail({ item }) {
  if (!item) return <div>Select an item to view details.</div>;

  return (
    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
      <h2>Details</h2>
      <pre>{JSON.stringify(item.properties, null, 2)}</pre>
    </div>
  );
}
