<!--
  A ladder's sizes as neutral badges: outlined where the size is used,
  disabled (the archived badge) where it isn't. Each badge's title is the
  caller's, so each plugin words its own.
-->
<script>
  import { Badge, Tooltip } from "figma-ui3-kit-svelte";

  /** @type {{ value: number, used: boolean, title: string }[]} */
  export let badges = [];
  /** Names the group, e.g. "Ladder sizes". */
  export let ariaLabel;
</script>

<div class="ladder" role="group" aria-label={ariaLabel}>
  <!-- By index: an imported ladder can repeat a value. Tooltips, not
       titles: a plugin's frame may not show a title. -->
  {#each badges as badge, i (i)}
    <Tooltip label={badge.title} direction="Top">
      <Badge
        variant={badge.used ? "default" : "archived"}
        ariaLabel="{badge.value}px, {badge.used ? 'used' : 'unused'}"
        >{badge.value}</Badge
      >
    </Tooltip>
  {/each}
</div>

<style>
  .ladder {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
</style>
