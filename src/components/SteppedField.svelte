<!--
  A field with − and + buttons after it, as one grid cell. The buttons call
  `onstep` with -1 or 1; what a step means is the caller's.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { IconButton } from "figma-ui3-kit-svelte";
  import { IconMinus, IconPlus } from "figma-ui3-kit-svelte/icons";

  interface Props {
    /** The − button's label, e.g. "Step body down". */
    downLabel: string;
    /** The + button's label, e.g. "Step body up". */
    upLabel: string;
    /** The field */
    children?: Snippet;
    /** -1 for the − button, 1 for the + button */
    onstep?: (step: -1 | 1) => void;
  }

  let { downLabel, upLabel, children, onstep }: Props = $props();
</script>

<div class="stepped">
  <div class="grow">
    {@render children?.()}
  </div>
  <div class="steppers">
    <IconButton
      iconName={IconMinus}
      ariaLabel={downLabel}
      onclick={() => onstep?.(-1)}
    />
    <IconButton
      iconName={IconPlus}
      ariaLabel={upLabel}
      onclick={() => onstep?.(1)}
    />
  </div>
</div>

<style>
  .stepped {
    display: flex;
    gap: var(--size-xxsmall);
    align-items: end;
    min-width: 0;
  }

  .grow {
    flex: 1;
    min-width: 0;
  }

  .steppers {
    display: flex;
  }
</style>
