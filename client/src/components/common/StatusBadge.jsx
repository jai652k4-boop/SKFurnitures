import { Clock, CheckCircle, Package, Truck, XCircle, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: {
            label: 'Pending',
            className: 'bg-yellow-100 text-yellow-700',
            icon: Clock,
            animate: true
        },
        confirmed: {
            label: 'Confirmed',
            className: 'bg-green-100 text-green-700',
            icon: CheckCircle,
            animate: false
        },
        accepted: {
            label: 'Accepted',
            className: 'bg-green-100 text-green-700',
            icon: CheckCircle,
            animate: false
        },
        processing: {
            label: 'Processing',
            className: 'bg-blue-100 text-blue-700',
            icon: Package,
            animate: true
        },
        manufacturing: {
            label: 'Manufacturing',
            className: 'bg-blue-100 text-blue-700',
            icon: Package,
            animate: true
        },
        shipped: {
            label: 'Shipped',
            className: 'bg-indigo-100 text-indigo-700',
            icon: Truck,
            animate: false
        },
        ready: {
            label: 'Ready',
            className: 'bg-indigo-100 text-indigo-700',
            icon: CheckCircle,
            animate: false
        },
        delivered: {
            label: 'Delivered',
            className: 'bg-green-100 text-green-700',
            icon: CheckCircle,
            animate: false
        },
        completed: {
            label: 'Completed',
            className: 'bg-green-100 text-green-700',
            icon: CheckCircle,
            animate: false
        },
        cancelled: {
            label: 'Cancelled',
            className: 'bg-red-100 text-red-700',
            icon: XCircle,
            animate: false
        }
    };

    const config = statusConfig[status] || {
        label: status,
        className: 'bg-blue-100 text-blue-700',
        icon: AlertCircle,
        animate: false
    };

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.className} ${config.animate ? 'animate-pulse' : ''}`}>
            <Icon size={14} />
            {config.label}
        </span>
    );
}

export default StatusBadge;
