<script lang="ts">
  import {
    addNotification,
    notificationStore,
    registerCallback,
    Notification as Notif,
    NotificationType,
  } from './NotifHandler.js';
  import Notification from './Notification.svelte';
  import { fade, fly } from 'svelte/transition';

  export let zindex = 1000000;

  // global utility callbacks
  registerCallback('void', () => false);
  registerCallback('dismiss-notif', () => true);
  registerCallback('copy-text', (action, notif) => {
    if (navigator.clipboard) {
      if (!notif.message) console.warn('No Notification Message');
      navigator.clipboard.writeText(notif.message ?? 'null');
      addNotification(
        new Notif('Copied!', 'Copied to Clipboard', NotificationType.Success)
      );
    } else
      alert(`Your browser does not support copying to clipboard.
Message: ${notif.message}`);
    return true;
  });
</script>

<div class="notifs" style="z-index:{zindex};">
  {#each $notificationStore as notif}
    <div in:fade={{ duration: 200 }} out:fly={{ x: 100, duration: 300 }}>
      <Notification notification={notif} />
    </div>
  {/each}
</div>

<style lang="scss">
  .notifs {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
    width: 350px;
  }
</style>
