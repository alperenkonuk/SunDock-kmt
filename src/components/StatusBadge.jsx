const StatusBadge = ({ status }) => {
  const labels = {
    active: 'Aktif',
    maintenance: 'Bakımda',
    offline: 'Arızalı',
  };

  return (
    <span className={`status-badge ${status}`}>
      <span className="status-badge-dot" />
      {labels[status] || status}
    </span>
  );
};

export default StatusBadge;
