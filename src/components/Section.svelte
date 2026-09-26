<!--
  Section: a titled group of fields, as in Figma's panels — a fieldset headed
  by Header, the title on its left and icon buttons at its right (the
  `actions` slot). It pads its own content, so its parent must not: the
  Header runs edge to edge. Rule sections apart with an <hr>.
-->
<script>
  import Header from "./Header.svelte";

  export let title;
</script>

<fieldset class="section" aria-label={title}>
  <Header {title} noBorder>
    <svelte:fragment slot="right">
      <slot name="actions" />
    </svelte:fragment>
  </Header>
  <div class="body">
    <slot />
  </div>
</fieldset>

<style>
  .section {
    display: flex;
    flex-direction: column;
    border: none;
    padding: 0;
    margin: 0;
  }

  /* The Header's own title is regular; a section's is strong, as in Figma's
     panels. */
  .section :global(.header__title) {
    font-weight: var(--font-weight-strong);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--size-xxsmall);
    padding: 0 var(--size-xsmall) var(--size-xsmall);
  }
</style>
