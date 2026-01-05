import { Clock, CheckCircle, Package, Truck, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
    const statusConfig = {
        pending: {
            label: 'Pending',
            className: 'badge-pending',
            icon: Clock,
            animate: true
        },
        confirmed: {
            label: 'Confirmed',
            className: 'badge-confirmed',
            icon: CheckCircle,
            animate: false
        },
        accepted: {
            label: 'Accepted',
            className: 'badge-confirmed',
            icon: CheckCircle,
            animate: false
        },
        processing: {
            label: 'Processing',
            className: 'badge-processing',
            icon: Package,
            animate: true
        },
        manufacturing: {
            label: 'Manufacturing',
            className: 'badge-processing',
            icon: Package,
            animate: true
        },
        shipped: {
            label: 'Shipped',
            className: 'badge-shipped',
            icon: Truck,
            animate: false
        },
        ready: {
            label: 'Ready',
            className: 'badge-shipped',
            icon: CheckCircle,
            animate: false
        },
        delivered: {
            label: 'Delivered',
            className: 'badge-delivered',
            icon: CheckCircle,
            animate: false
        },
        completed: {
            label: 'Completed',
            className: 'badge-completed',
            icon: CheckCircle,
            animate: false
        },
        cancelled: {
            label: 'Cancelled',
            className: 'badge-cancelled',
            icon: XCircle,
            animate: false
        }
    };

    const config = statusConfig[status] || {
        label: status,
        className: 'badge-info',
        icon: AlertCircle,
        animate: false
    };

    const Icon = config.icon;

    return (
        <span className={`badge ${config.className} ${config.animate ? 'animate-pulse' : ''}`}>
            <Icon size={14} />
            {config.label}
        </span>
    );
}
