export const SPECIAL_DATES = ['0103', '0106'];

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

export const CUSTOM_CONFETTI = {
  '0103': {
    getCustomConfettiShape: heartShape,
    customMessage: 'Happy Day! 🎉',
  },
  '0104': {
    getCustomConfettiShape: spiralShape,
    customMessage: 'Happy Hypnosis Day! 🎉',
  },
  '0106': {
    getCustomConfettiShape: spiralShape,
    customMessage: 'Happy Three Wise Men Day! 🎉',
  },
};
