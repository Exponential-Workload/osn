// Notif State Handler
import { writable } from 'svelte/store';
import type { ComponentType } from 'svelte';
import jsf32 from './RNG.js';

/** Action Interface */
export type NotificationAction = {
  /** Action Callback Name */
  callback?: string,
  /** Action Name */
  name: string,
  /** Metadata */
  metadata?: any,
}

/** ID Generator | using rng + id to prevent collisions */
const getId = (() => {
  const base = Date.now();
  let id = 0;
  const seed = new Uint32Array(4);
  crypto.getRandomValues(seed);
  const rng = jsf32(seed[0], seed[1], seed[2], seed[3]);
  return () => `${base.toString(16)}-${(++id).toString(16)}-${rng(0, 1e9).toString(36)}#${rng(0, 1e9).toString(36)}`;
})();

/** Notification Interface */
type INotification = {
  /** Identification used for removing it */
  id?: string,
  /** Notification title */
  title: string | null,
  /** Notification message */
  message: string | null,
  /** Notification type */
  type: NotificationType,
  /** Notification duration */
  duration: number,
  /** Notification timestamp */
  timestamp: number,
  /** Notification expiry */
  expires_at: number,
  /** Notification Actions */
  actions?: NotificationAction[],
  /** Icon */
  icon?: ComponentType | null,
  /** Can Dismiss */
  dismissable?: boolean,
}

/** Notification Type | giant list ik */
export enum NotificationType {
  /** Success */
  Success = 'success',
  /** Success */
  Ok = 'success',
  /** Error */
  Error = 'error',
  /** Error */
  Err = 'error',
  /** Error */
  Fail = 'error',
  /** Error */
  NotOk = 'error',
  /** Warning */
  Warning = 'warning',
  /** Warning */
  Warn = 'warning',
  /** Info */
  Info = 'info',
  /** Info */
  Inf = 'info',
  /** Info */
  Notice = 'info',
}

/** Notification Class */
export class Notification implements INotification {
  /** Notification expiry */
  private _expires_at: number = 0;
  /** Notification duration */
  private _duration: number = 0;
  /** Notification timestamp */
  private _timestamp: number = 0;
  /** Notification ID */
  public id: string = '';
  /** Notification title */
  public title: string | null = null;
  /** Notification message */
  public message: string | null = null;
  /** Notification type */
  public type: NotificationType = NotificationType.Info;
  /** Icon */
  public icon: ComponentType | null = null;
  /** Notification duration */
  public get duration(): number {
    return this._duration;
  }
  /** Notification duration */
  public set duration(duration: number) {
    this._duration = duration;
    this._expires_at = this.timestamp + this.duration;
  }
  /** Notification timestamp */
  public get timestamp(): number {
    return this._timestamp;
  }
  /** Notification expiry */
  public get expires_at(): number {
    return this._expires_at;
  }
  /** Notification expiry */
  public set expires_at(expires_at: number) {
    this._expires_at = expires_at;
    this._duration = this.expires_at - this.timestamp;
  }
  /** Dismissable */
  public dismissable: boolean = true;
  /** Notification Actions */
  public actions: NotificationAction[] = [];

  /** Notification Class Constructor */
  public constructor(title: string | null, message: string | null = null, type: NotificationType | null = NotificationType.Info, duration: number | null = 5000, dismissable: boolean = true, actions: NotificationAction[] = [], icon: ComponentType | null = null) {
    this.id = getId();
    if (message === null && title === null) throw new Error('Notification must have a message or a title')
    this.title = title;
    this.message = message;
    this.type = type ?? NotificationType.Info;
    this.duration = duration ?? 5000;
    this._timestamp = Date.now();
    this._expires_at = this.timestamp + this.duration;
    this.dismissable = dismissable;
    this.actions = actions;
    this.icon = icon;
  }

  /** Alternative Constructor */
  public static fromObject(obj: Partial<INotification>): Notification {
    let notif = new Notification(obj.title ?? null, obj.message ?? null, obj.type ?? null, obj.duration ?? null, obj.dismissable ?? true, obj.actions ?? [], obj.icon ?? null);
    notif.id = obj.id ?? notif.id;
    notif._timestamp = obj.timestamp ?? notif.timestamp;
    notif._expires_at = obj.expires_at ?? notif.expires_at;
    return notif;
  }

  /** Import from Notification */
  public static import(notification: INotification): Notification {
    let notif = new Notification(notification.title, notification.message, notification.type, notification.duration, notification.dismissable);
    notif.id = notification.id ?? notif.id;
    notif._timestamp = notification.timestamp;
    notif._expires_at = notification.expires_at;
    return notif;
  }

  /** Validate INotification */
  public static isValidExport(notification: INotification): boolean {
    if (typeof notification !== 'object') return false;
    if (typeof notification.id !== 'number') return false;
    if (typeof notification.title !== 'string' && notification.title !== null) return false;
    if (typeof notification.message !== 'string') return false;
    if (typeof notification.type !== 'string') return false;
    if (typeof notification.duration !== 'number') return false;
    if (typeof notification.timestamp !== 'number') return false;
    if (typeof notification.expires_at !== 'number') return false;
    return true;
    // ty gh copilot
  }

  /** Check if is expired */
  public isExpired(): boolean {
    return Date.now() > this.expires_at;
  }

  /** Export */
  public export(): string {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      message: this.message,
      type: this.type,
      duration: this.duration,
      timestamp: this.timestamp,
      expires_at: this.expires_at,
      dismissable: this.dismissable,
    })
  }

  /** Get Expiration Progress */
  public getExpirationProgress(): number {
    return (Date.now() - this.timestamp) / this.duration;
  }

  /** Destroy */
  public destroy(): void {
    removeNotification(this.id);
  }
  /** Dismiss */
  public dismiss(): void {
    this.destroy()
  }
}

export const notificationStore = writable<Notification[]>([])
export const removeNotification = (id: string) => {
  notificationStore.update((notifications) => {
    return notifications.filter((notif) => notif.id !== id);
  })
}
export const addNotification = (notification: Notification) => {
  // Push Notification
  notificationStore.update((notifications) => {
    notifications.push(notification);
    return notifications;
  })
  // Remove notification after duration
  setTimeout(() => {
    removeNotification(notification.id);
  }, Date.now() - notification.timestamp + notification.duration) // usually equals to notification.duration, unless added after export->reimport
}

// Save Notifications to Session Storage across reloads, if available
notificationStore.subscribe((notifications) => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('notifications', JSON.stringify(notifications.map((notification) => notification.export())));
  }
})

export const svelteMount = (() => {
  // Load Notifications from Session Storage, if available
  if (typeof sessionStorage !== 'undefined') {
    const notifications = sessionStorage.getItem('notifications');
    if (notifications !== null) {
      const parsed = JSON.parse(notifications);
      if (typeof parsed === 'object' && parsed.forEach) {
        const invalidNotifications = parsed.filter((notif: INotification) => !Notification.isValidExport(notif)).length
        if (invalidNotifications > 0) {
          console.warn(invalidNotifications + ' invalid notification objects in session storage');
        } else {
          parsed.forEach((notif: INotification) => {
            addNotification(Notification.import(notif));
          })
        }
      } else {
        console.warn('Invalid notifications object in session storage');
      }
    }
  }
})

/**
 * Notification Action
 * @param {NotificationAction} action Action
 * @param {INotification} notification Notification
 * @returns {boolean | void} Return true to dismiss
 */
export type Callback = (action: NotificationAction, notification: INotification) => boolean | void
export let callbacks: { [key: string]: Callback } = {}
export const registerCallback = (callback: string, callbackFunction: Callback) => {
  callbacks[callback] = callbackFunction;
  return callback;
}
