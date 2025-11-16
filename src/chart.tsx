/** @jsx createElement */
import { createElement, useEffect } from './jsx-runtime';
import { DataPoint } from './data-service';

// src/chart.tsx
// Part 4.1: Chart Component

// TODO: Build a chart component using HTML5 Canvas

// TODO: Define props for chart component
export interface ChartProps {
  type: 'bar' | 'line' | 'pie';
  data: DataPoint[];
  width?: number;
  height?: number;
}

const Chart = ({ type, data, width = 500, height = 300 }: ChartProps) => {
  let canvasRef: HTMLCanvasElement | null = null;

  const setRef = (el: HTMLCanvasElement) => {
    canvasRef = el;
  };

  // Sử dụng useEffect để vẽ lên canvas sau khi nó được render
  useEffect(() => {
    if (canvasRef && data.length > 0) {
      const ctx = canvasRef.getContext('2d');
      if (!ctx) return;

      // Xóa canvas trước khi vẽ
      ctx.clearRect(0, 0, width, height);

      // TODO: Implement drawing functions
      switch (type) {
        case 'bar':
          drawBarChart(ctx, data, width, height);
          break;
        case 'line':
          drawLineChart(ctx, data, width, height);
          break;
        case 'pie':
          drawPieChart(ctx, data, width, height);
          break;
      }
    }
  }, [type, data, width, height]); // Chạy lại khi props thay đổi

  return (
    <canvas ref={setRef} width={width} height={height} style={{
      /* Gỡ bỏ style dư thừa, Card đã xử lý */
      borderRadius: '8px',
      margin: '0',
      width: '100%',
      height: 'auto'
    }}></canvas>
  );
};

// --- Drawing Functions (Chủ đề HỒNG) ---

// - drawBarChart()
function drawBarChart(ctx: CanvasRenderingContext2D, data: DataPoint[], width: number, height: number) {
  const padding = 50;
  const barWidth = (width - 2 * padding) / data.length * 0.8;
  const barSpacing = (width - 2 * padding) / data.length * 0.2;
  const maxValue = Math.max(...data.map(d => d.value));
  const scale = (height - 2 * padding) / maxValue;

  ctx.font = "12px 'Inter', sans-serif";
  data.forEach((d, i) => {
    const x = padding + i * (barWidth + barSpacing);
    const barHeight = d.value * scale;
    const y = height - padding - barHeight;

    // Draw bar (Màu hồng)
    ctx.fillStyle = '#ff80ab'; 
    ctx.strokeStyle = '#c51162'; // Viền hồng đậm
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeRect(x, y, barWidth, barHeight);

    // Draw label
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x + barWidth / 2, height - padding + 20);
  });
  
  // Draw Axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.strokeStyle = '#555';
  ctx.stroke();
}

// - drawLineChart()
function drawLineChart(ctx: CanvasRenderingContext2D, data: DataPoint[], width: number, height: number) {
  const padding = 50;
  const maxValue = Math.max(...data.map(d => d.value));
  const scale = (height - 2 * padding) / maxValue;
  const xStep = (width - 2 * padding) / (data.length - 1);

  ctx.lineWidth = 2;
  ctx.font = "12px 'Inter', sans-serif";
  
  // Draw the line path (Màu hồng)
  ctx.beginPath();
  data.forEach((d, i) => {
    const x = padding + i * xStep;
    const y = height - padding - d.value * scale;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = '#f50057'; // Màu hồng đậm
  ctx.stroke();

  // Draw points and labels
  data.forEach((d, i) => {
    const x = padding + i * xStep;
    const y = height - padding - d.value * scale;

    // Draw point
    ctx.beginPath();
    ctx.fillStyle = '#ad1457'; // Màu hồng sẫm
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw label
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x, height - padding + 20);
  });

  // Draw Axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.stroke();
}

// - drawPieChart()
function drawPieChart(ctx: CanvasRenderingContext2D, data: DataPoint[], width: number, height: number) {
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;
  let startAngle = 0;

  // Bảng màu hồng mới
  const colors = ['#e91e63', '#f06292', '#f50057', '#ff80ab', '#ad1457', '#f8bbd0', '#d81b60'];

  data.forEach((d, i) => {
    const sliceAngle = (d.value / totalValue) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    
    ctx.fillStyle = colors[i % colors.length];
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    // Draw label
    const labelAngle = startAngle + sliceAngle / 2;
    const labelX = centerX + (radius + 20) * Math.cos(labelAngle);
    const labelY = centerY + (radius + 20) * Math.sin(labelAngle);
    ctx.fillStyle = '#333';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = (labelX < centerX) ? 'right' : 'left';
    ctx.fillText(`${d.label} (${((d.value / totalValue) * 100).toFixed(1)}%)`, labelX, labelY);

    startAngle = endAngle;
  });
}

export { Chart };