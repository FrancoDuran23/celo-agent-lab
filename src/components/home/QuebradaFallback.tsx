/**
 * Versión estática (SVG) del fondo "quebrada" para navegadores sin WebGPU
 * y para el instante previo al primer cuadro del shader.
 */
export function QuebradaFallback() {
  return (
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="qf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1626" />
          <stop offset="0.55" stopColor="#1d1d3f" />
          <stop offset="1" stopColor="#3a2546" />
        </linearGradient>
        <radialGradient id="qf-sun" cx="0.76" cy="0.44" r="0.28">
          <stop offset="0" stopColor="#f5d9a8" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#d9877f" stopOpacity="0.18" />
          <stop offset="1" stopColor="#0b1626" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="800" fill="url(#qf-sky)" />
      <rect width="1440" height="800" fill="url(#qf-sun)" />
      <circle cx="1095" cy="350" r="26" fill="#f6e4bf" opacity="0.9" />
      <g opacity="0.9">
        <path d="M0 470 C180 430 330 455 480 420 S820 380 980 400 S1260 360 1440 372 V800 H0Z" fill="#4a3a6e" />
        <path d="M0 520 C200 480 360 500 520 470 S840 430 1010 455 S1290 410 1440 425 V800 H0Z" fill="#6a4c93" opacity="0.85" />
        <path d="M0 565 C190 530 370 548 540 520 S860 485 1040 505 S1300 470 1440 480 V800 H0Z" fill="#7f6a5c" />
        <path d="M0 605 C210 572 380 590 560 566 S880 532 1060 552 S1310 520 1440 530 V800 H0Z" fill="#b35f4a" />
        <path d="M0 645 C220 615 400 632 580 610 S900 580 1080 598 S1320 570 1440 578 V800 H0Z" fill="#c98a5a" />
        <path d="M0 690 C230 660 420 676 600 656 S920 628 1100 645 S1330 620 1440 628 V800 H0Z" fill="#8a6f8f" />
        <path d="M0 735 C240 708 440 722 620 704 S940 680 1120 694 S1340 672 1440 680 V800 H0Z" fill="#5a3a3a" />
      </g>
    </svg>
  );
}
