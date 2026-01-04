export default function StatusBadge({ status }) {
    const styles = {
        pending: 'badge-pending',
        confirmed: 'badge-confirmed',
        accepted: 'badge-confirmed',
        manufacturing: 'badge-cooking',
        ready: 'badge-ready',
        completed: 'badge-completed',
        cancelled: 'badge-cancelled'
    };

    const labels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        accepted: 'Accepted',
        manufacturing: 'Manufacturing',
        ready: 'Ready',
        completed: 'Completed',
        cancelled: 'Cancelled'
    };

    return (
        <span className={`badge ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
            {labels[status] || status}
        </span>
    );
}
