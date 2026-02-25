interface AppNotification {
    title: string;
    body: string;
    icon?: string;
}

class NotificationService {
    public async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) return false;
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    public async showNotification(notification: AppNotification): Promise<void> {
        if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(notification.title, {
                body: notification.body,
                icon: notification.icon || '/pwa-192x192.png',
            });
        } else if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.body,
                icon: notification.icon,
            });
        }
    }
}

export default new NotificationService();