import './ObjectList.css';

export default function ObjectList({ items, onSelect, selectedId }) {
  if (!items.length) return <div>No items found.</div>;

  return (
    <ul className="object-list">
      {items.map(item => (
        <li
          key={item.id}
          className={`object-list-item ${item.id === selectedId ? 'selected' : ''}`}
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
