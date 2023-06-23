# OpenSvelteNotif

Svelte library for displaying notifications.

## Example Usage

src/routes/+layout.svelte
```html
<script lang="ts">
  import { NotifHost } from 'opensveltenotif';
</script>

<NotifHost />
```

src/routes/+page.svelte
```html
<script lang="ts">
  import { addNotification, Notification, NotificationType } from 'opensveltenotif';
  const pushNotification = () => addNotification(new Notification('Title','*Description* with **markdown**', NotificationType.Info, 5000, true));
</script>

<button on:click={pushNotification}>Click Me</button>
```

## API

All of the below are direct exports of the package.

### addNotification
```ts
addNotification(notification: Notification): void
```
Adds a [notification](#notification) to the notification queue.

### removeNotification
```ts
removeNotification(id: string): void
```
Removes a notification from the notification queue.

You can get the id of a notification from the `id` property of the notification object.

### Notification
```ts
new Notification(title: string, description: string, type: NotificationType, duration?: number, dismissable?: boolean, actions?: NotificationAction[])
```
Creates a new notification.

### NotificationType
```ts
enum NotificationType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}
```
The type of notification.

### Callback
```ts
type Callback = (action: NotificationAction, notification: INotification) => boolean | void
```
A callback for a notification action.

### registerCallback
```ts
registerCallback(name: string, callback: Callback): void
```
Registers a callback for a notification action.

### NotificationAction
```ts
type NotificationAction = {
  /** Action Callback Name */
  callback?: string,
  /** Action Name */
  name: string,
  /** Metadata */
  metadata?: any,
}
```
An action that can be added to a notification.

## Attribution

This is heavily based on the notification system implemented in [Moon Client](https://github.com/moon-client/launcher-oss) by myself.
