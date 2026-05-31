<template>
  <div class="upload-illustration">
    <svg
      class="upload-illustration__svg"
      viewBox="0 0 320 120"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <!-- Browser window -->
      <rect
        x="88"
        y="28"
        width="144"
        height="84"
        rx="8"
        class="upload-illustration__browser"
      />
      <rect
        x="88"
        y="28"
        width="144"
        height="18"
        rx="8"
        class="upload-illustration__browser-bar"
      />
      <rect
        x="88"
        y="38"
        width="144"
        height="8"
        class="upload-illustration__browser-bar-fill"
      />
      <circle
        cx="100"
        cy="37"
        r="3"
        class="upload-illustration__dot upload-illustration__dot--1"
      />
      <circle
        cx="110"
        cy="37"
        r="3"
        class="upload-illustration__dot upload-illustration__dot--2"
      />
      <circle
        cx="120"
        cy="37"
        r="3"
        class="upload-illustration__dot upload-illustration__dot--3"
      />

      <!-- Route path inside browser -->
      <path
        d="M104 88 C 130 52, 160 96, 216 58"
        fill="none"
        class="upload-illustration__route"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <circle
        cx="104"
        cy="88"
        r="4"
        class="upload-illustration__pin"
      />
      <circle
        cx="216"
        cy="58"
        r="4"
        class="upload-illustration__pin upload-illustration__pin--end"
      />
      <circle
        class="upload-illustration__ping"
        cx="216"
        cy="58"
        r="8"
      />

      <!-- Floating file document -->
      <g class="upload-illustration__file">
        <rect
          x="36"
          y="18"
          width="36"
          height="46"
          rx="4"
          class="upload-illustration__file-body"
        />
        <path
          d="M44 32h20M44 40h16M44 48h12"
          class="upload-illustration__file-lines"
          stroke-width="2"
          stroke-linecap="round"
        />
        <text
          x="54"
          y="62"
          class="upload-illustration__file-label"
          text-anchor="middle"
        >CSV</text>
        <!-- Drop arrow -->
        <path
          d="M54 72 L54 82 M48 76 L54 82 L60 76"
          class="upload-illustration__arrow"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </g>

      <!-- Shield badge (local/privacy hint) -->
      <g class="upload-illustration__shield">
        <path
          d="M252 72 L252 58 a8 8 0 0 1 16 0 v14 a8 8 0 0 1 -8 7 a8 8 0 0 1 -8 -7z"
          class="upload-illustration__shield-body"
        />
        <path
          d="M256 68 l3 3 6 -6"
          class="upload-illustration__shield-check"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.upload-illustration {
  padding: var(--space-md) var(--space-lg);
  background:
    linear-gradient(180deg, var(--color-sky) 0%, var(--color-paper-2) 100%);
  border-bottom: 1px solid var(--color-rule);
}

.upload-illustration__svg {
  display: block;
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
  height: auto;
}

.upload-illustration__browser {
  fill: var(--color-paper);
  stroke: var(--color-rule);
  stroke-width: 1.5;
}

.upload-illustration__browser-bar {
  fill: var(--color-paper-2);
}

.upload-illustration__browser-bar-fill {
  fill: var(--color-paper-2);
}

.upload-illustration__dot {
  fill: var(--color-rule);
}

.upload-illustration__dot--1 {
  fill: oklch(65% 0.18 25 / 0.7);
}

.upload-illustration__dot--2 {
  fill: oklch(72% 0.14 85 / 0.7);
}

.upload-illustration__dot--3 {
  fill: oklch(62% 0.12 145 / 0.7);
}

.upload-illustration__route {
  stroke: var(--color-accent);
  opacity: 0.85;
}

.upload-illustration__pin {
  fill: var(--color-accent);
}

.upload-illustration__pin--end {
  animation: upload-illustration-ping 2.4s var(--ease-out) infinite;
}

.upload-illustration__ping {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 1.5;
  opacity: 0;
  transform-origin: 216px 58px;
  animation: upload-illustration-ring 2.4s var(--ease-out) infinite;
}

.upload-illustration__file-body {
  fill: var(--color-paper);
  stroke: var(--color-accent-border);
  stroke-width: 1.5;
}

.upload-illustration__file-lines {
  stroke: var(--color-ink-2);
  opacity: 0.5;
}

.upload-illustration__file-label {
  font-family: var(--font-body);
  font-size: 8px;
  font-weight: 700;
  fill: var(--color-accent);
  letter-spacing: 0.04em;
}

.upload-illustration__arrow {
  stroke: var(--color-accent);
  opacity: 0.7;
}

.upload-illustration__file {
  animation: upload-illustration-float 3s ease-in-out infinite;
}

.upload-illustration__shield-body {
  fill: var(--color-accent-bg);
  stroke: var(--color-accent-border);
  stroke-width: 1.5;
}

.upload-illustration__shield-check {
  stroke: var(--color-accent);
}

@keyframes upload-illustration-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

@keyframes upload-illustration-ping {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

@keyframes upload-illustration-ring {
  0% {
    transform: scale(0.6);
    opacity: 0.6;
  }

  70%,
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .upload-illustration__file,
  .upload-illustration__pin--end,
  .upload-illustration__ping {
    animation: none;
  }
}
</style>
