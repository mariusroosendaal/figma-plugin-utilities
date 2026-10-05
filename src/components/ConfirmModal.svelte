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

  <svelte:fragment slot="footer-right">
    <Button variant="secondary" on:click={() => answerConfirm(false)}>
      {$confirmRequest?.cancelLabel || "Cancel"}
    </Button>
    <Button
      variant={$confirmRequest?.destructive ? "destructive" : "primary"}
      on:click={() => answerConfirm(true)}
    >
      {$confirmRequest?.confirmLabel ?? ""}
    </Button>
  </svelte:fragment>
</Modal>
