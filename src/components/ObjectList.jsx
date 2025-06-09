export default function ObjectList({ items, onSelect }) {
  if (!items.length) return <div>No items found.</div>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map(item => (
        <li
          key={item.id}
          style={{
            cursor: 'pointer',
            padding: '8px',
            borderBottom: '1px solid #ddd',
          }}
          onClick={() => onSelect(item)}
        >
          {item.properties.firstname
            ? `${item.properties.firstname} ${item.properties.lastname || ''}`
            : item.properties.name || item.properties.dealname || 'No Name'}
        </li>
      ))}
    </ul>
  );
}
