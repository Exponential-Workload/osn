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
          'Test Error',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl ul, nisl eget aliqu amet, consectetur adipiscing elit. Nullam euismod, n\'est.',
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
  <button
    on:click={() => {
      addNotification(
        new Notification(
          'Test Info',
          'Lorem ipsum dolor!',
          NotificationType.Success,
          100000,
          true,
          []
        )
      );
      addNotification(
        new Notification(
          'Test Info',
          'Lorem ipsum dolor!',
          NotificationType.Info,
          100000,
          true,
          []
        )
      );
      addNotification(
        new Notification(
          'Test Error',
          'Lorem ipsum dolor sit amet',
          NotificationType.Error,
          100000,
          true,
          [
            {
              name: 'Text',
              callback: 'copy',
            },
          ]
        )
      );
      addNotification(
        new Notification(
          'Test Error',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl ul, nisl eget aliqu amet, consectetur adipiscing elit. Nullam euismod, n\'est.',
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
    }}>Make Notifs</button
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
