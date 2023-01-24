import { getRandomInt } from 'utils/helpers';

const ghostShape = (ctx, eyesColor) => {
  const x = 0;
  const y = 0;
  const scale = 0.6;

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo((x + 19) * scale, (y - 90) * scale, (x + 40) * scale, y * scale);
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo((x + 3) * scale, (y + 4) * scale, (x + 10) * scale, y * scale);
  ctx.moveTo((x + 10) * scale, y * scale);
  ctx.quadraticCurveTo((x + 12) * scale, (y - 2) * scale, (x + 20) * scale, y * scale);
  ctx.moveTo((x + 20) * scale, y * scale);
  ctx.quadraticCurveTo((x + 22) * scale, (y + 4) * scale, (x + 30) * scale, y * scale);
  ctx.moveTo((x + 30) * scale, y * scale);
  ctx.quadraticCurveTo((x + 35) * scale, (y - 2) * scale, (x + 40) * scale, y * scale);
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  ctx.fillStyle = eyesColor;
  ctx.beginPath();
  ctx.arc((x + 14) * scale, (y - 29) * scale, 2 * scale, 0, Math.PI * 8, true);
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.fill();
  ctx.beginPath();
  ctx.arc((x + 25) * scale, (y - 29) * scale, 2 * scale, 0, Math.PI * 8, true);
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.fill();
};

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
  let k = 0;
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

const houseShape = ctx => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.strokeRect(0, 0, 16, 16);
  ctx.fillRect(5, 8, 5, 8);
  ctx.moveTo(-5, 0);
  ctx.lineTo(8, -10);
  ctx.lineTo(21, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
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

const LShape = ctx => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.fillRect(0, 0, 30, 10);
  ctx.moveTo(0, 0);
  ctx.fillRect(0, 0, 10, 20);
  ctx.closePath();
  ctx.stroke();
};

const lineShape = ctx => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.fillRect(0, 0, 40, 10);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

const squareShape = ctx => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.fillRect(0, 0, 20, 20);
  ctx.closePath();
  ctx.stroke();
};

const TShape = ctx => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.fillRect(0, 0, 30, 10);
  ctx.moveTo(10, -10);
  ctx.fillRect(10, -10, 10, 10);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

const ZShape = ctx => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.fillRect(0, 0, 20, 10);
  ctx.moveTo(10, -10);
  ctx.fillRect(10, -10, 20, 10);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

function tetrisShape(ctx) {
  if (!this.newRan) {
    this.randomInt = getRandomInt(5);
    this.newRan = true;
  }

  switch (this.randomInt) {
    case 0:
      ZShape(ctx);
      break;
    case 1:
      LShape(ctx);
      break;
    case 2:
      squareShape(ctx);
      break;
    case 3:
      lineShape(ctx);
      break;
    default:
      TShape(ctx);
      break;
  }
}

export const CUSTOM_CONFETTI_ANNUAL = {
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
  '0606': {
    confettiExtraParams: {
      drawShape: tetrisShape,
      numberOfPieces: 1000,
    },
    customMessage: 'Happy Tetris day! 🎉',
  },
  '0621': {
    confettiExtraParams: {
      drawShape: snowflakeShape,
      colors: ['#AEE1FF', '#CBDDF8'],
    },
    customMessage: 'Happy Winter! 🎉',
  },
  1031: {
    confettiExtraParams: {
      drawShape: ctx => ghostShape(ctx, 'red'),
    },
    customMessage: 'Happy Halloween! 👻 🎃',
  },
};

export const CUSTOM_CONFETTI = {
  20230113: {
    confettiExtraParams: {
      drawShape: ctx => ghostShape(ctx, 'black'),
      numberOfPieces: 1000,
    },
    customMessage: 'Happy Friday the 13th! 👻',
  },
  20230118: {
    confettiExtraParams: {
      drawShape: houseShape,
    },
  },
  20230125: {
    confettiExtraParams: {
      drawShape: tetrisShape,
      numberOfPieces: 1000,
    },
    customMessage: 'Tomorrow (Jan 26) board games at Rootstrap Uruguay (office) 🎲 🃏',
  },
  20230128: {
    confettiExtraParams: {
      drawShape: ctx => ghostShape(ctx, 'black'),
      numberOfPieces: 1000,
    },
    customMessage: 'Happy Saturday Pablito! 👻',
  },
};
