<!--
  A field with − and + buttons after it, as one grid cell. The buttons fire
  `step` with -1 or 1; what a step means is the caller's.
-->
<script>
  import { createEventDispatcher } from "svelte";
  import { IconButton } from "figma-ui3-kit-svelte";
  import { IconMinus, IconPlus } from "figma-ui3-kit-svelte/icons";

  /** The − button's label, e.g. "Step body down". */
  export let downLabel;
  /** The + button's label, e.g. "Step body up". */
  export let upLabel;

  const dispatch = createEventDispatcher();
</script>

<div class="stepped">
  <div class="grow">
    <slot />
  </div>
  <div class="steppers">
    <IconButton
      iconName={IconMinus}
      ariaLabel={downLabel}
      on:click={() => dispatch("step", -1)}
    />
    <IconButton
      iconName={IconPlus}
      ariaLabel={upLabel}
      on:click={() => dispatch("step", 1)}
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
