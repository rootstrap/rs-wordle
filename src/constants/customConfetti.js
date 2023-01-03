const heartShape = ctx => {
  ctx.beginPath();
  let w = 20;
  let h = 20;
  ctx.strokeStyle = 'white';
  ctx.strokeWeight = 1;
  ctx.shadowOffsetX = 4.0;
  ctx.shadowOffsetY = 4.0;
  ctx.lineWidth = 5;
  ctx.fillStyle = 'red';
  let d = Math.min(w, h);
  let k = 20;
  ctx.moveTo(k, k + d / 4);
  ctx.quadraticCurveTo(k, k, k + d / 4, k);
  ctx.quadraticCurveTo(k + d / 2, k, k + d / 2, k + d / 4);
  ctx.quadraticCurveTo(k + d / 2, k, k + (d * 3) / 4, k);
  ctx.quadraticCurveTo(k + d, k, k + d, k + d / 4);
  ctx.quadraticCurveTo(k + d, k + d / 2, k + (d * 3) / 4, k + (d * 3) / 4);
  ctx.lineTo(k + d / 2, k + d);
  ctx.lineTo(k + d / 4, k + (d * 3) / 4);
  ctx.quadraticCurveTo(k, k + d / 2, k, k + d / 4);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
};

const spiralShape = ctx => {
  ctx.beginPath();
  for (let i = 0; i < 22; i++) {
    const angle = 0.35 * i;
    const x = (0.2 + 1.5 * angle) * Math.cos(angle);
    const y = (0.2 + 1.5 * angle) * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.closePath();
};

const starShape = ctx => {
  const numPoints = 5;
  const outerRadius = 10;
  const innerRadius = outerRadius / 2;
  ctx.beginPath();
  ctx.moveTo(0, 0 - outerRadius);

  for (let n = 1; n < numPoints * 2; n++) {
    const radius = n % 2 === 0 ? outerRadius : innerRadius;
    const x = radius * Math.sin((n * Math.PI) / numPoints);
    const y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
    ctx.lineTo(x, y);
  }
  ctx.fill();
  ctx.closePath();
};

const snowflakeShape = ctx => {
  const numPoints = 8;
  const innerRadius = 2 * 0.2;
  const outerRadius = 2 * 0.8;
  ctx.beginPath();
  ctx.moveTo(0, 0 - outerRadius);

  for (let n = 1; n < numPoints * 2; n++) {
    const radius = n % 2 === 0 ? outerRadius : innerRadius;
    const x = radius * Math.sin((n * Math.PI) / numPoints);
    const y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
    ctx.lineTo(x, y);
  }
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};

export const CUSTOM_CONFETTI = {
  '0104': {
    confettiExtraParams: {
      drawShape: spiralShape,
    },
    customMessage: 'Happy Hypnosis Day! 🎉',
  },
  '0106': {
    confettiExtraParams: {
      drawShape: starShape,
    },
    customMessage: 'Happy Three Wise Men Day! 🎉',
  },
  '0214': {
    confettiExtraParams: {
      drawShape: heartShape,
    },
    customMessage: "Happy Valentine's Day! 🎉",
  },
  '0621': {
    confettiExtraParams: {
      drawShape: snowflakeShape,
      colors: ['#AEE1FF', '#CBDDF8'],
    },
    customMessage: 'Happy Winter! 🎉',
  },
};
