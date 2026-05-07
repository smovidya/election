<script lang="ts">
  interface Props {
    totalVotes?: number;
    loading?: boolean;
  }

  let { totalVotes = 326, loading = false }: Props = $props();

  let currentCount = $state(0);

  $effect(() => {
    let start = 0;
    let end = totalVotes;
    let duration = 2000;
    let startTime = performance.now();
    let animationFrame: number;

    loading = false; // We start animating immediately when totalVotes is provided

    function updateCount(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      currentCount = Math.floor(progress * (end - start) + start);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    }

    animationFrame = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  });
</script>

<div class="flex flex-col items-center">
  <h3 class="font-noto text-dgray text-center text-md mb-2">
    จำนวนผู้ใช้สิทธิ์เลือกตั้งทั้งหมด
  </h3>

  <h1
    id="counter"
    class="font-museo text-center text-dgray text-4xl mb-2"
    class:animate-pulse={loading}
  >
    {loading ? "Loading..." : `${currentCount.toLocaleString()} คน`}
  </h1>
<!-- 
  <h3 class="font-noto text-dgray text-center text-sm">
    จากผู้มีสิทธิ์เลือกตั้ง 3,743 คน
  </h3> -->
</div>

<style>
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  .animate-pulse {
    animation: pulse 1s infinite;
  }
</style>
