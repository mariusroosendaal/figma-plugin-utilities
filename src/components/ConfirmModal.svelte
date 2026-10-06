<!--
  The dialog confirmAction() opens: mount one in the plugin's UI, after
  everything else, so it shows above any modal that asks.
-->
<script>
  import { Modal, Button, Text } from "figma-ui3-kit-svelte";
  import { confirmRequest, answerConfirm } from "../lib/confirm";
</script>

<Modal
  isOpen={!!$confirmRequest}
  title={$confirmRequest?.title ?? ""}
  width="small"
  position="center"
  on:close={() => answerConfirm(false)}
>
  <Text>{$confirmRequest?.message ?? ""}</Text>

  <svelte:fragment slot="footer-full">
    <div class="confirm-footer">
      <div class="confirm-actions">
        <Button variant="secondary" on:click={() => answerConfirm(false)}>
          {$confirmRequest?.cancelLabel || "Cancel"}
        </Button>
        <Button
          variant={$confirmRequest?.destructive ? "destructive" : "primary"}
          on:click={() => answerConfirm(true)}
        >
          {$confirmRequest?.confirmLabel ?? ""}
        </Button>
      </div>
    </div>
  </svelte:fragment>
</Modal>

<style>
  /* The kit's footer is 40px tall; this one grows with stacked buttons. */
  :global(.modal-footer:has(.confirm-footer)) {
    height: auto;
  }

  /* The footer's width, which the buttons are laid out by. */
  .confirm-footer {
    container-type: inline-size;
  }

  .confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--size-xxsmall);
    width: 100%;
  }

  /* In a narrow window, such as a 240px plugin, the buttons don't fit side
     by side: they stack at full width, the confirming one on top. */
  @container (max-width: 215px) {
    .confirm-actions {
      flex-direction: column-reverse;
      align-items: stretch;
    }

    .confirm-actions > :global(*) {
      width: 100%;
    }
  }
</style>
