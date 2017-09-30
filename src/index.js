import Controller from './controller';
import './breakout.css';

const controller = new Controller([
  { bricks: [{ size: 2, canBreak: true }, { size: 2, canBreak: true }, { size: 2, canBreak: true }, { size: 2, canBreak: true }], life: 3, colors: ["green", "yellow", "red"] },
  { bricks: [{ size: 1, canBreak: true }, { size: 2, canBreak: true }, { size: 2, canBreak: true }, { size: 2, canBreak: true }, { size: 1, canBreak: true }], life: 2, colors: ["green", "yellow"] },
  { bricks: [{ size: 2, canBreak: true }, { size: 2, canBreak: true }, { size: 2, canBreak: true }, { size: 2, canBreak: true }], life: 1, colors: ["green"] }
]);
