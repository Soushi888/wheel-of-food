const canvas = document.getElementById("wheelCanvas") as HTMLCanvasElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;
if (!canvas || !resultDiv) {
  throw new Error("Required DOM elements not found");
}

const ctx = canvas.getContext("2d")!;

const foodOptions: string[] = [
  "Pizza",
  "Burger",
  "Sushi",
  "Pasta",
  "Salad",
  "Tacos",
  "Steak",
  "Ice Cream",
];

const colors: string[] = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8BC34A",
  "#F44336",
];

const numSegments: number = foodOptions.length;

let centerX: number = 0;
let centerY: number = 0;
let outerRadius: number = 0;

let currentAngle: number = 0;
let angularVelocity: number = 0;
let spinning: boolean = false;
const friction: number = 0.995;

function drawWheel(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const anglePerSegment = (2 * Math.PI) / numSegments;
  for (let i = 0; i < numSegments; i++) {
    const startAngle = currentAngle + i * anglePerSegment;
    const endAngle = startAngle + anglePerSegment;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + anglePerSegment / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#333";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(foodOptions[i], outerRadius - 10, 10);
    ctx.restore();
  }

  // Draw pointer
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.beginPath();
  ctx.moveTo(centerX - 11, centerY - outerRadius - 4);
  ctx.lineTo(centerX + 11, centerY - outerRadius - 4);
  ctx.lineTo(centerX, centerY - outerRadius + 25);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX - 10, centerY - outerRadius - 5);
  ctx.lineTo(centerX + 10, centerY - outerRadius - 5);
  ctx.lineTo(centerX, centerY - outerRadius + 23);
  ctx.closePath();
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
}

function resizeCanvas(): void {
  const size = canvas.clientWidth;
  canvas.width = size;
  canvas.height = size;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  outerRadius = Math.min(centerX, centerY) - 10;
  drawWheel();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function animate(): void {
  if (spinning) {
    currentAngle += angularVelocity;
    angularVelocity *= friction;
    if (Math.abs(angularVelocity) < 0.0005) {
      spinning = false;
      angularVelocity = 0;
      let normalizedAngle = currentAngle % (2 * Math.PI);
      if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
      const pointerAngle =
        ((3 * Math.PI) / 2 - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
      const segmentIndex = Math.floor(
        pointerAngle / ((2 * Math.PI) / numSegments)
      );
      resultDiv.textContent = "You got: " + foodOptions[segmentIndex] + "!";
    }
  }
  drawWheel();
  requestAnimationFrame(animate);
}

animate();

const spinButton = document.getElementById("spinButton");
if (spinButton) {
  spinButton.addEventListener("click", () => {
    if (!spinning) {
      resultDiv.textContent = "";
      angularVelocity = Math.random() * 0.3 + 0.3;
      spinning = true;
    }
  });
}
