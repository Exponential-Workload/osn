<script lang="ts">
  import {
    Notification,
    NotificationType,
    addNotification,
  } from '../lib/NotifHandler.js';
</script>

<main>
  <h1>OpenSvelteNotif Playground</h1>

  <button
    on:click={() => {
      addNotification(
        new Notification(
          'Login Error',
          'Your HWID does not match, please create a HWID Reset Ticket.',
          NotificationType.Error,
          100000,
          true,
          [
            {
              name: 'Copy',
              callback: 'copy',
            },
          ]
        )
      );
    }}>Make Notif</button
  >
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    font-family: Inter;
  }
</style>
