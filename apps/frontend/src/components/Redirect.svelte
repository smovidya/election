<script lang="ts">
  let { href }: { href: string } = $props();
  
  $effect(() => {
    window.location.href = href;
  });
</script>
