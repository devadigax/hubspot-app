import './ObjectDetail.css';

export default function ObjectDetail({ item }) {
  if (!item) return <div>Select an item to view details.</div>;

  const properties = item.properties;

  return (
    <div className="detail-container">
      <h2>Details</h2>
      <table className="detail-table">
        <tbody>
          {Object.entries(properties).map(([key, value]) => (
            <tr key={key}>
              <td className="label">{key}</td>
              <td>{value ?? <span className="null-value">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
