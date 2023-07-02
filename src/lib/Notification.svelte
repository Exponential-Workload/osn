<script lang="ts">
  import showdown from 'showdown';
  import {
    callbacks,
    registerCallback,
    type Notification,
    NotificationType,
  } from './NotifHandler.js';
  import { onMount, type ComponentType } from 'svelte';
  import ExclamationCircle from './icons/ExclamationCircle.svelte';
  import InformatiaonCircle from './icons/InformatiaonCircle.svelte';
  import CheckCircle from './icons/CheckCircle.svelte';
  import ExclamationTriangle from './icons/ExclamationTriangle.svelte';
  import QuestionMarkCircle from './icons/QuestionMarkCircle.svelte';

  const md = new showdown.Converter();
  export let notification: Notification;
  let firstFramePassed = false;
  onMount(() => {
    setTimeout(() => {
      firstFramePassed = true;
    }, 0);
  });
  $: actions = [
    ...(notification.actions ?? []),
    ...(notification.dismissable
      ? [{ name: 'Dismiss', callback: 'dismiss-notif' }]
      : []),
  ];
  const generateFallbackCallback = (callback: string) => () => {
    console.warn(`Callback ${callback} not found`);
    return true;
  };
  let autoselectedIcon: ComponentType = (() => {
    switch (notification.type) {
      case NotificationType.Error:
        return ExclamationCircle;
      case NotificationType.Info:
        return InformatiaonCircle;
      case NotificationType.Success:
        return CheckCircle;
      case NotificationType.Warning:
        return ExclamationTriangle;
      default:
        return QuestionMarkCircle;
    }
  })();
</script>

<div class="notif {notification.type} flex-col">
  <div class="p-3">
    <div class="flex flex-row">
      <svelte:component
        this={notification.icon ?? autoselectedIcon}
        colour="#fff"
      />
      <div
        style="max-width: 246px;{[
          notification.title,
          notification.message,
        ].filter((v) => !!v).length <= 1
          ? 'display:flex;align-items:center;justify-content:center;'
          : ''}"
      >
        {#if notification.title}
          <h2
            style="font-weight:700;font-size:1.1rem;display:flex;align-items:center;min-height:1.4rem;margin: 0 0;margin-top:0.3rem;"
          >
            {notification.title}
          </h2>
        {/if}
        {#if notification.message}
          <div style="font-size:13px;opacity:0.7;">
            {#if notification.message}
              {@html md.makeHtml(notification.message)}
            {/if}
          </div>
        {/if}

        <div class="buttons" style="margin-top:6px">
          {#each actions as action}
            <button
              class="bg-slate-900 mr-2 rounded-md py-1 px-1.5 text-xs text-neutral-300"
              on:click={() => {
                if (action.callback) {
                  const result = (
                    callbacks[action.callback] ??
                    generateFallbackCallback(action.callback)
                  )(action, notification);
                  if (result) notification.dismiss();
                }
              }}
            >
              {action.name}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use 'sass:color';

  $errorAccent: #ff7777ff;
  $infoAccent: #77c9ff;
  $successAccent: #77ff77ff;
  $warningAccent: #ffff77ff;
  $baseColor: #1e293b;
  // mini tailwind polyfill for the notification component
  .flex-row {
    flex-direction: row;
  }

  .flex {
    display: flex;
  }

  .w-9 {
    width: 2.25rem;
  }

  .mr-3 {
    margin-right: 0.75rem;
  }

  .mr-3 {
    margin-right: 0.75rem;
  }

  .p-3 {
    padding: 0.75rem;
  }

  .flex-col {
    flex-direction: column;
  }

  .font-bold {
    font-weight: 700;
  }

  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .pt-1 {
    padding-top: 0.25rem;
  }

  h2 {
    margin: 0;
  }

  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  .px-1\.5 {
    padding-left: 0.375rem;
    padding-right: 0.375rem;
  }

  .bg-slate-900 {
    --tw-bg-opacity: 1;
    background-color: rgb(15 23 42 / var(--tw-bg-opacity));
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .mr-2 {
    margin-right: 0.5rem;
  }

  button {
    cursor: pointer;
    border: 0px none #0000;
  }

  button {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none;
  }

  button {
    text-transform: none;
  }

  button {
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }

  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  .px-1\.5 {
    padding-left: 0.375rem;
    padding-right: 0.375rem;
  }

  .bg-slate-900 {
    --tw-bg-opacity: 1;
    background-color: rgb(15 23 42 / var(--tw-bg-opacity));
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .mr-2 {
    margin-right: 0.5rem;
  }
  button {
    cursor: pointer;
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none;
    text-transform: none;
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }
  // styles
  .notif {
    display: flex;
    background: var(--background, #fff2);
    backdrop-filter: blur(10px);
    border-radius: 0.5rem;
    width: 100%;
    border: 1px solid var(--accent);
    position: relative;
    z-index: 2;
    transition: 0.5s;
    width: max-content;
    font-family: Inter, sans-serif;
    color: #fff;
    max-width: 318px;

    &.error {
      --accent: #{$errorAccent};
      --background: #{color.adjust(
          $errorAccent,
          $blackness: +100%,
          $alpha: -0.7
        )};
    }

    &.info {
      --accent: #{$infoAccent};
      --background: #{color.adjust($infoAccent, $blackness: +100%, $alpha: -0.7)};
    }

    &.success {
      --accent: #{$successAccent};
      --background: #{color.adjust(
          $successAccent,
          $blackness: +100%,
          $alpha: -0.7
        )};
    }

    &.warning {
      --accent: #{$warningAccent};
      --background: #{color.adjust(
          $warningAccent,
          $blackness: +100%,
          $alpha: -0.7
        )};
    }

    &::before,
    &::after {
      content: '';
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: var(--accent);
      opacity: 0.2;
      filter: blur(25px);
      pointer-events: none;
    }

    &::before {
      z-index: 1;
    }

    &::after {
      z-index: 3;
      opacity: 0.1;
    }

    :global(svg) {
      width: 2.25rem;
      height: 2.25rem;
      margin-right: 0.75rem;
    }

    :global(p) {
      margin: 0.5em 0;
      margin-bottom: 0.2rem;
    }

    button {
      background: rgb(15, 23, 42);
    }
  }
</style>
