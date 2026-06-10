import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDown,
  ArrowUp,
  Download,
  ImagePlus,
  Layers,
  Move,
  RefreshCcw,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  Eye,
  EyeOff,
} from 'lucide-react'
import './styles.css'

const formatPresets = [
  { id: 'x-landscape', name: 'X 横長', description: '16:9', width: 1600, height: 900 },
  { id: 'x-portrait', name: 'X 縦長', description: '4:5', width: 1080, height: 1350 },
  { id: 'x-square', name: 'X 正方形', description: '1:1', width: 1080, height: 1080 },
  { id: 'instagram-feed', name: 'Instagram', description: 'Feed 4:5', width: 1080, height: 1350 },
]

const templates = [
  {
    id: 'gallery-card',
    name: 'Clean Frame',
    description: '淡い背景と細い枠。',
    frameInset: 34,
    frameWidth: 4,
    radius: 0,
    palettes: [
      { id: 'linen', name: 'Linen', background: '#f6f3ee', muted: '#8b8177', stroke: '#242424', text: '#242424', textMuted: '#6f675f', grid: '#d8cec2' },
      { id: 'mist', name: 'Mist', background: '#eef4f6', muted: '#7e929c', stroke: '#293943', text: '#293943', textMuted: '#687c86', grid: '#c8dce4' },
      { id: 'rose', name: 'Rose', background: '#f8eff2', muted: '#9a7a84', stroke: '#3d2a31', text: '#3d2a31', textMuted: '#886b75', grid: '#ead0d8' },
    ],
  },
  {
    id: 'editorial-dark',
    name: 'Editorial Dark',
    description: '暗色背景と淡い枠。',
    frameInset: 32,
    frameWidth: 3,
    radius: 0,
    palettes: [
      { id: 'charcoal', name: 'Charcoal', background: '#181818', muted: '#b7aa98', stroke: '#f4eadb', text: '#f4eadb', textMuted: '#b7aa98', grid: '#3e4650', side: 'rgba(255,255,255,0.05)' },
      { id: 'ink-blue', name: 'Ink Blue', background: '#151b26', muted: '#98aac2', stroke: '#dce8fa', text: '#e8f0fb', textMuted: '#9eb0c8', grid: '#38465c', side: 'rgba(145,180,230,0.08)' },
      { id: 'plum', name: 'Plum', background: '#211827', muted: '#c3a9c9', stroke: '#f5ddf7', text: '#f8e8fb', textMuted: '#c8adc9', grid: '#4b3853', side: 'rgba(235,190,245,0.07)' },
    ],
  },
  {
    id: 'soft-poster',
    name: 'Soft Poster',
    description: '淡色グラデーションと白枠。',
    frameInset: 38,
    frameWidth: 8,
    radius: 26,
    textInsetMultiplier: 1.9,
    innerFrameGapMultiplier: 3.2,
    palettes: [
      { id: 'powder', name: 'Powder', background: '#f7f0f4', gradientFrom: '#fff8ee', gradientTo: '#dfeef0', muted: '#7b727d', stroke: '#ffffff', text: '#2e3c45', textMuted: '#7b727d', grid: '#d5e4e9' },
      { id: 'peach', name: 'Peach', background: '#fff0e8', gradientFrom: '#fff9ef', gradientTo: '#f1dfe8', muted: '#947a72', stroke: '#ffffff', text: '#49353a', textMuted: '#947a72', grid: '#efd5ca' },
      { id: 'mint', name: 'Mint', background: '#edf8f1', gradientFrom: '#fffaf0', gradientTo: '#dceee7', muted: '#6f887b', stroke: '#ffffff', text: '#2d443d', textMuted: '#6f887b', grid: '#cfe5d9' },
    ],
  },
  {
    id: 'pastel-grid',
    name: 'Pastel Wave',
    description: '白背景と上下のなみなみ枠。',
    frameInset: 24,
    frameWidth: 0,
    radius: 0,
    textInsetMultiplier: 1.2,
    palettes: [
      { id: 'blue', name: 'Blue', background: '#b9ddf6', wave: '#b9ddf6', xTop: 'rgba(135, 140, 235, 0.78)', xBottom: 'rgba(114, 205, 235, 0.72)', muted: '#9ab4dc', stroke: '#ffffff', text: '#7f7ec5', textMuted: '#8d9acb', grid: 'rgba(154, 190, 222, 0.34)' },
      { id: 'pink', name: 'Pink', background: '#f7cddd', wave: '#f7cddd', xTop: 'rgba(213, 143, 207, 0.76)', xBottom: 'rgba(255, 165, 190, 0.74)', muted: '#d49aad', stroke: '#ffffff', text: '#9c6185', textMuted: '#b78398', grid: 'rgba(218, 153, 179, 0.34)' },
      { id: 'orange', name: 'Orange', background: '#f7c49d', wave: '#f7c49d', xTop: 'rgba(112, 190, 218, 0.72)', xBottom: 'rgba(238, 142, 132, 0.74)', muted: '#d49774', stroke: '#ffffff', text: '#98613f', textMuted: '#b97958', grid: 'rgba(218, 151, 111, 0.34)' },
      { id: 'yellow', name: 'Yellow', background: '#f7dea0', wave: '#f7dea0', xTop: 'rgba(177, 148, 224, 0.74)', xBottom: 'rgba(248, 202, 109, 0.76)', muted: '#caa35a', stroke: '#ffffff', text: '#8d7132', textMuted: '#a98745', grid: 'rgba(219, 181, 96, 0.34)' },
      { id: 'green', name: 'Green', background: '#bfe7ce', wave: '#bfe7ce', xTop: 'rgba(112, 184, 217, 0.74)', xBottom: 'rgba(122, 210, 177, 0.74)', muted: '#8bbda0', stroke: '#ffffff', text: '#4f856e', textMuted: '#6f9e88', grid: 'rgba(135, 190, 160, 0.34)' },
      { id: 'purple', name: 'Purple', background: '#d8cdf7', wave: '#d8cdf7', xTop: 'rgba(153, 136, 226, 0.76)', xBottom: 'rgba(126, 203, 185, 0.72)', muted: '#aaa0d9', stroke: '#ffffff', text: '#7366b5', textMuted: '#9086c4', grid: 'rgba(169, 158, 220, 0.34)' },
    ],
  },
  {
    id: 'pastel-wave-solid',
    name: 'Pastel Solid',
    description: '濃い背景と白い映画枠。',
    frameInset: 24,
    frameWidth: 0,
    radius: 0,
    textInsetMultiplier: 1.2,
    pastelWave: true,
    solidPastel: true,
    palettes: [
      { id: 'blue', name: 'Blue', background: '#88c7f1', wave: '#ffffff', xTop: 'rgba(255,255,255,0.96)', xBottom: 'rgba(244,250,255,0.9)', muted: 'rgba(255,255,255,0.82)', stroke: '#ffffff', text: '#ffffff', textMuted: 'rgba(255,255,255,0.86)', grid: 'rgba(255,255,255,0.72)' },
      { id: 'pink', name: 'Pink', background: '#efa8c2', wave: '#ffffff', xTop: 'rgba(255,255,255,0.96)', xBottom: 'rgba(255,246,251,0.9)', muted: 'rgba(255,255,255,0.82)', stroke: '#ffffff', text: '#ffffff', textMuted: 'rgba(255,255,255,0.86)', grid: 'rgba(255,255,255,0.72)' },
      { id: 'orange', name: 'Orange', background: '#eea36e', wave: '#ffffff', xTop: 'rgba(255,255,255,0.96)', xBottom: 'rgba(255,249,240,0.9)', muted: 'rgba(255,255,255,0.82)', stroke: '#ffffff', text: '#ffffff', textMuted: 'rgba(255,255,255,0.86)', grid: 'rgba(255,255,255,0.72)' },
      { id: 'yellow', name: 'Yellow', background: '#e7bd58', wave: '#ffffff', xTop: 'rgba(255,255,255,0.96)', xBottom: 'rgba(255,252,237,0.9)', muted: 'rgba(255,255,255,0.82)', stroke: '#ffffff', text: '#ffffff', textMuted: 'rgba(255,255,255,0.86)', grid: 'rgba(255,255,255,0.72)' },
      { id: 'green', name: 'Green', background: '#83c99f', wave: '#ffffff', xTop: 'rgba(255,255,255,0.96)', xBottom: 'rgba(244,255,249,0.9)', muted: 'rgba(255,255,255,0.82)', stroke: '#ffffff', text: '#ffffff', textMuted: 'rgba(255,255,255,0.86)', grid: 'rgba(255,255,255,0.72)' },
      { id: 'purple', name: 'Purple', background: '#b7a6ec', wave: '#ffffff', xTop: 'rgba(255,255,255,0.96)', xBottom: 'rgba(249,247,255,0.9)', muted: 'rgba(255,255,255,0.82)', stroke: '#ffffff', text: '#ffffff', textMuted: 'rgba(255,255,255,0.86)', grid: 'rgba(255,255,255,0.72)' },
    ],
  },
]

const handleNames = ['nw', 'ne', 'se', 'sw']
const minLayerSize = 40
const defaultLayerEffects = {
  stickerColor: '#ffffff',
  stickerOffset: 18,
  borderEnabled: false,
  borderColor: '#ffffff',
  shadowEnabled: true,
  shadowColor: '#8aa0bc',
  shadowOpacity: 0.28,
}

const decorationModes = [
  ['cross', 'バツ'],
  ['confetti', '紙吹雪'],
  ['bubbles', '円'],
  ['triangles', '三角'],
  ['dot-party', 'ドット'],
  ['sparkles', 'キラキラ'],
  ['diamond-chain', 'ひし形'],
  ['clouds', '雲'],
]

const patternModes = [
  ['none', 'なし'],
  ['wavy', '波線'],
  ['straight', '直線'],
  ['dotted', '点線'],
  ['dots', 'ドット'],
  ['stripe-v', '縦縞'],
  ['stripe-h', '横縞'],
  ['stripe-diagonal', '斜線'],
]

const fontOptions = [
  { id: 'system', name: '標準', family: '"Yu Gothic", "Hiragino Sans", "Inter", sans-serif' },
  { id: 'zen-maru', name: 'Zen 丸ゴ', family: '"Zen Maru Gothic", "Yu Gothic", sans-serif' },
  { id: 'm-plus-rounded', name: 'M PLUS 丸', family: '"M PLUS Rounded 1c", "Yu Gothic", sans-serif' },
  { id: 'kiwi-maru', name: 'Kiwi 丸', family: '"Kiwi Maru", "Yu Gothic", serif' },
  { id: 'yomogi', name: 'Yomogi', family: '"Yomogi", "Yu Gothic", cursive' },
  { id: 'kaisei-decol', name: 'Kaisei Decol', family: '"Kaisei Decol", "Yu Mincho", serif' },
  { id: 'kaisei-opti', name: 'Kaisei Opti', family: '"Kaisei Opti", "Yu Mincho", serif' },
  { id: 'kaisei-tokumin', name: 'Kaisei Tokumin', family: '"Kaisei Tokumin", "Yu Mincho", serif' },
  { id: 'kaisei-haruno', name: 'Kaisei HarunoUmi', family: '"Kaisei HarunoUmi", "Yu Mincho", serif' },
  { id: 'hachi-maru', name: 'Hachi Maru', family: '"Hachi Maru Pop", "Yu Gothic", cursive' },
]

function getFontFamily(fontId) {
  return (fontOptions.find((item) => item.id === fontId) ?? fontOptions[0]).family
}

function isPastelWaveTemplate(template) {
  return template.id === 'pastel-grid' || template.pastelWave
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function getWrappedLines(ctx, text, maxWidth) {
  const lines = []
  let line = ''
  for (const char of text.split('')) {
    const testLine = line + char
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line)
      line = char
    } else {
      line = testLine
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  getWrappedLines(ctx, text, maxWidth).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight)
  })
}

function drawWavePath(ctx, width, y, amplitude, wavelength, direction) {
  ctx.beginPath()
  ctx.moveTo(0, y)
  for (let x = 0; x <= width + wavelength; x += wavelength / 2) {
    const controlX = x + wavelength / 4
    const endX = x + wavelength / 2
    const controlY = y + amplitude * direction
    ctx.quadraticCurveTo(controlX, controlY, endX, y)
  }
}

function solidColor(color) {
  const rgba = String(color).match(/rgba?\(([^)]+)\)/)
  if (!rgba) return color
  const [r, g, b] = rgba[1].split(',').map((part) => Math.round(Number(part.trim())))
  return `rgb(${r}, ${g}, ${b})`
}

function colorWithAlpha(color, alpha) {
  if (String(color).startsWith('#')) {
    const hex = color.slice(1)
    const value = hex.length === 3
      ? hex.split('').map((char) => char + char).join('')
      : hex
    const r = parseInt(value.slice(0, 2), 16)
    const g = parseInt(value.slice(2, 4), 16)
    const b = parseInt(value.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  const rgba = String(color).match(/rgba?\(([^)]+)\)/)
  if (!rgba) return color
  const [r, g, b] = rgba[1].split(',').map((part) => Math.round(Number(part.trim())))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function createSeededRandom(seed) {
  let state = Math.max(1, Math.floor(Number(seed) || 1)) % 2147483647
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

function randomRange(random, min, max) {
  return min + (max - min) * random()
}

function getDecorationColors(palette) {
  return [
    solidColor(palette.xTop ?? palette.grid ?? palette.stroke ?? palette.text),
    solidColor(palette.xBottom ?? palette.muted ?? palette.textMuted ?? palette.background),
    solidColor(palette.textMuted ?? palette.muted ?? palette.stroke ?? palette.text),
  ]
}

function drawPastelWaveBase(ctx, width, height, palette, solid = false) {
  ctx.fillStyle = solid ? palette.background : '#ffffff'
  ctx.fillRect(0, 0, width, height)
}

function drawPastelWaveFrame(ctx, width, height, palette) {
  const scale = Math.min(width, height) / 1080
  const topWaveY = Math.round(height * 0.12)
  const bottomWaveY = Math.round(height * 0.88)
  const amp = Math.round(24 * scale)
  const wave = Math.round(150 * scale)

  ctx.save()
  ctx.fillStyle = palette.wave ?? palette.background
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(width, 0)
  ctx.lineTo(width, topWaveY)
  for (let x = width; x >= -wave; x -= wave / 2) {
    ctx.quadraticCurveTo(x - wave / 4, topWaveY + amp, x - wave / 2, topWaveY)
  }
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(0, height)
  ctx.lineTo(width, height)
  ctx.lineTo(width, bottomWaveY)
  for (let x = width; x >= -wave; x -= wave / 2) {
    ctx.quadraticCurveTo(x - wave / 4, bottomWaveY - amp, x - wave / 2, bottomWaveY)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawSolidPastelLines(ctx, width, height) {
  const scale = Math.min(width, height) / 1080
  const barHeight = Math.max(14, Math.round(28 * scale))

  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillRect(0, 0, width, barHeight)
  ctx.fillRect(0, height - barHeight, width, barHeight)
  ctx.restore()
}

function drawSparkleShape(ctx, x, y, size, color, rotation = 0) {
  const inner = size * 0.18
  const outer = size
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, -outer)
  ctx.bezierCurveTo(inner * 0.45, -inner * 1.4, inner * 1.4, -inner * 0.45, outer, 0)
  ctx.bezierCurveTo(inner * 1.4, inner * 0.45, inner * 0.45, inner * 1.4, 0, outer)
  ctx.bezierCurveTo(-inner * 0.45, inner * 1.4, -inner * 1.4, inner * 0.45, -outer, 0)
  ctx.bezierCurveTo(-inner * 1.4, -inner * 0.45, -inner * 0.45, -inner * 1.4, 0, -outer)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawDiamond(ctx, x, y, size, color, rotation = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, -size / 2)
  ctx.lineTo(size / 2, 0)
  ctx.lineTo(0, size / 2)
  ctx.lineTo(-size / 2, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawFluffyCloud(ctx, x, y, size, color, rotation = 0) {
  const w = size
  const h = size * 0.5
  const bufferWidth = Math.ceil(w * 1.75)
  const bufferHeight = Math.ceil(h * 2)
  const buffer = document.createElement('canvas')
  const bufferCtx = buffer.getContext('2d')
  buffer.width = bufferWidth
  buffer.height = bufferHeight
  const originX = bufferWidth / 2
  const originY = bufferHeight / 2

  bufferCtx.fillStyle = color
  ;[
    [0, 0.18, 0.56, 0.35],
    [-0.46, 0.15, 0.26, 0.34],
    [-0.24, -0.08, 0.33, 0.46],
    [0.04, -0.24, 0.42, 0.58],
    [0.34, -0.1, 0.34, 0.46],
    [0.55, 0.12, 0.24, 0.32],
    [-0.24, 0.36, 0.24, 0.18],
    [0.04, 0.38, 0.2, 0.16],
    [0.28, 0.34, 0.24, 0.18],
  ].forEach(([cx, cy, rw, rh]) => {
    bufferCtx.beginPath()
    bufferCtx.ellipse(originX + cx * w, originY + cy * h, rw * w, rh * h, 0, 0, Math.PI * 2)
    bufferCtx.fill()
  })

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.drawImage(buffer, -bufferWidth / 2, -bufferHeight / 2)
  ctx.restore()
}

function drawPastelDecorations(ctx, width, height, palette, decoration) {
  if (!decoration?.enabled || decoration.mode === 'none') return
  const sizeFactor = Math.max(0.45, Math.min(1.8, Number(decoration.scale ?? 1)))
  const sizeVariance = Math.max(0, Math.min(1, Number(decoration.sizeVariance ?? 0.35)))
  const scale = (Math.min(width, height) / 1080) * sizeFactor
  const opacity = Math.max(0.1, Math.min(1, Number(decoration.opacity ?? 0.62)))
  const random = createSeededRandom(decoration.seed ?? 1)
  const [colorA, colorB, colorC] = getDecorationColors(palette)
  const topY = Math.round(height * 0.24)
  const bottomY = Math.round(height * 0.76)

  ctx.save()
  ctx.globalAlpha = opacity
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (decoration.mode === 'cross') {
    ctx.lineWidth = Math.round(30 * scale)
    const xSize = Math.round(76 * scale)
    const xGap = Math.round(72 * scale)
    ;[
      { start: width * 0.74, y: topY, color: colorA },
      { start: width * 0.02, y: bottomY, color: colorB },
    ].forEach((row) => {
      ctx.strokeStyle = row.color
      for (let x = row.start; x < width + xSize; x += xSize + xGap) {
        ctx.beginPath()
        ctx.moveTo(x, row.y - xSize / 2)
        ctx.lineTo(x + xSize, row.y + xSize / 2)
        ctx.moveTo(x + xSize, row.y - xSize / 2)
        ctx.lineTo(x, row.y + xSize / 2)
        ctx.stroke()
      }
    })
  }

  if (decoration.mode === 'confetti') {
    const pieces = [
      [0.09, 0.26, 18, colorA], [0.18, 0.18, -12, colorB], [0.31, 0.29, 8, colorC],
      [0.72, 0.22, -18, colorB], [0.84, 0.32, 10, colorA], [0.92, 0.18, 22, colorC],
      [0.12, 0.74, -10, colorB], [0.28, 0.82, 16, colorA], [0.69, 0.78, 8, colorC],
      [0.83, 0.69, -20, colorA], [0.94, 0.82, 14, colorB],
      [0.06, 0.44, 24, colorC], [0.2, 0.48, -28, colorA], [0.42, 0.2, 14, colorB],
      [0.58, 0.3, -8, colorC], [0.66, 0.12, 26, colorA], [0.78, 0.48, -22, colorB],
      [0.37, 0.72, 18, colorC], [0.48, 0.86, -16, colorB], [0.58, 0.68, 28, colorA],
      [0.74, 0.88, -10, colorC], [0.92, 0.62, 18, colorB],
    ]
    pieces.forEach(([px, py, rot, color], index) => {
      const pieceVariance = 1 + randomRange(random, -sizeVariance, sizeVariance)
      const w = [28, 34, 40, 46, 32][index % 5] * pieceVariance * scale
      const h = [24, 30, 22, 36, 28][index % 5] * pieceVariance * randomRange(random, 0.92, 1.08) * scale
      const skew = [0.18, -0.12, 0.08, -0.18, 0.14][index % 5] * w
      ctx.save()
      ctx.translate(width * (px + randomRange(random, -0.025, 0.025)), height * (py + randomRange(random, -0.025, 0.025)))
      ctx.rotate(((rot + randomRange(random, -18, 18)) * Math.PI) / 180)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(-w / 2 + skew, -h / 2)
      ctx.lineTo(w / 2, -h / 2 + Math.abs(skew) * 0.35)
      ctx.lineTo(w / 2 - skew, h / 2)
      ctx.lineTo(-w / 2, h / 2 - Math.abs(skew) * 0.3)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    })
  }

  if (decoration.mode === 'bubbles') {
    const circles = [
      [0.1, 0.22, 78, colorB], [0.22, 0.31, 48, colorA], [0.79, 0.24, 66, colorA],
      [0.9, 0.36, 44, colorC], [0.15, 0.72, 72, colorA], [0.31, 0.79, 44, colorC],
      [0.72, 0.72, 58, colorB], [0.88, 0.8, 84, colorA],
      [0.43, 0.42, 38, colorC], [0.56, 0.56, 54, colorA], [0.48, 0.68, 32, colorB],
      [0.62, 0.38, 36, colorC],
    ]
    circles.forEach(([px, py, r, color]) => {
      const x = width * (px + randomRange(random, -0.035, 0.035))
      const y = height * (py + randomRange(random, -0.035, 0.035))
      const radius = r * (1 + randomRange(random, -sizeVariance, sizeVariance)) * scale
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  if (decoration.mode === 'triangles') {
    const triangles = [
      [0.08, 0.3, 96, 76, -10, 0.05, colorA],
      [0.26, 0.22, 58, 86, 20, -0.16, colorB],
      [0.78, 0.31, 112, 64, -16, 0.18, colorC],
      [0.93, 0.2, 62, 70, 12, 0.1, colorB],
      [0.16, 0.81, 88, 54, 18, -0.22, colorC],
      [0.75, 0.75, 92, 118, -18, 0.14, colorA],
      [0.9, 0.84, 76, 48, 8, -0.08, colorB],
      [0.44, 0.44, 66, 74, -24, 0.12, colorA],
      [0.58, 0.55, 84, 50, 18, -0.18, colorC],
      [0.48, 0.69, 58, 78, 34, 0.08, colorB],
      [0.63, 0.37, 72, 58, -8, -0.1, colorA],
    ]
    triangles.forEach(([px, py, base, heightValue, rot, lean, color]) => {
      const triangleVariance = 1 + randomRange(random, -sizeVariance, sizeVariance)
      const w = base * triangleVariance * randomRange(random, 0.92, 1.08) * scale
      const h = heightValue * triangleVariance * randomRange(random, 0.92, 1.08) * scale
      const leanX = lean * w
      ctx.save()
      ctx.translate(width * (px + randomRange(random, -0.035, 0.035)), height * (py + randomRange(random, -0.035, 0.035)))
      ctx.rotate(((rot + randomRange(random, -16, 16)) * Math.PI) / 180)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(leanX, -h / 2)
      ctx.lineTo(w / 2, h / 2)
      ctx.lineTo(-w / 2, h / 2 - Math.abs(leanX) * 0.25)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    })
  }

  if (decoration.mode === 'dot-party') {
    const clusters = [
      [0.11, 0.25, colorA], [0.83, 0.2, colorB], [0.22, 0.78, colorB],
      [0.74, 0.76, colorA], [0.9, 0.56, colorC],
    ]
    clusters.forEach(([px, py, color], clusterIndex) => {
      const originX = width * (px + randomRange(random, -0.03, 0.03))
      const originY = height * (py + randomRange(random, -0.03, 0.03))
      const clusterVariance = 1 + randomRange(random, -sizeVariance, sizeVariance)
      const gap = 32 * clusterVariance * randomRange(random, 0.92, 1.08) * scale
      const size = (clusterIndex % 2 === 0 ? 15 : 13) * clusterVariance * scale
      ctx.fillStyle = color
      for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 4; col += 1) {
          const jitterX = ((row + clusterIndex) % 2) * 2 * scale
          const jitterY = ((col + clusterIndex) % 2) * 1.5 * scale
          const x = originX + (col - 1.5) * gap + jitterX
          const y = originY + (row - 1.5) * gap + jitterY
          roundRect(ctx, x - size / 2, y - size / 2, size, size, size * 0.18)
          ctx.fill()
        }
      }
    })
  }

  if (decoration.mode === 'sparkles') {
    const sparkles = [
      [0.13, 0.24, 72, colorA], [0.28, 0.34, 34, colorB], [0.46, 0.2, 48, colorC],
      [0.76, 0.27, 62, colorB], [0.9, 0.42, 32, colorA], [0.58, 0.52, 42, colorC],
      [0.18, 0.72, 46, colorC], [0.4, 0.82, 30, colorA], [0.72, 0.75, 56, colorA],
      [0.88, 0.82, 38, colorB],
    ]
    sparkles.forEach(([px, py, size, color], index) => {
      const variance = 1 + randomRange(random, -sizeVariance, sizeVariance)
      drawSparkleShape(
        ctx,
        width * (px + randomRange(random, -0.035, 0.035)),
        height * (py + randomRange(random, -0.035, 0.035)),
        size * variance * scale,
        color,
        0,
      )
    })
  }

  if (decoration.mode === 'diamond-chain') {
    const chains = [
      [0.08, 0.22, 72, colorA, 3],
      [0.72, 0.53, 56, colorB, 3],
      [0.04, 0.86, 66, colorC, 4],
      [0.84, 0.2, 42, colorA, 2],
      [0.28, 0.74, 48, colorB, 3],
    ]
    chains.forEach(([px, py, size, color, count], chainIndex) => {
      const variance = 1 + randomRange(random, -sizeVariance, sizeVariance)
      const diamondSize = size * variance * scale
      const gap = diamondSize * randomRange(random, 1.25, 1.55)
      const startX = width * (px + randomRange(random, -0.025, 0.025))
      const startY = height * (py + randomRange(random, -0.025, 0.025))
      const tilt = randomRange(random, -4, 4) * Math.PI / 180
      for (let index = 0; index < count; index += 1) {
        drawDiamond(
          ctx,
          startX + index * gap,
          startY,
          diamondSize,
          color,
          tilt,
        )
      }
    })
  }

  if (decoration.mode === 'clouds') {
    const clouds = [
      [0.52, 0.13, 260, -2, colorA],
      [0.96, 0.23, 190, 1, colorB],
      [-0.04, 0.44, 220, -1, colorC],
      [0.42, 0.58, 180, 2, colorA],
      [0.72, 0.77, 145, -2, colorB],
      [0.08, 0.84, 165, 1, colorC],
    ]
    clouds.forEach(([px, py, size, rot, color]) => {
      const variance = 1 + randomRange(random, -sizeVariance * 0.45, sizeVariance * 0.45)
      drawFluffyCloud(
        ctx,
        width * (px + randomRange(random, -0.025, 0.025)),
        height * (py + randomRange(random, -0.025, 0.025)),
        size * variance * scale,
        color,
        ((rot + randomRange(random, -2, 2)) * Math.PI) / 180,
      )
    })
  }

  ctx.restore()
}

function drawGridOverlay(ctx, width, height, grid) {
  if (!grid || grid.mode === 'none') return
  const scale = Math.min(width, height) / 1080
  const spacing = Math.max(10, Math.round(Number(grid.spacing ?? 108) * scale))
  const lineWidth = Math.max(0.5, Number(grid.width) * scale)
  const opacity = Math.max(0.05, Math.min(1, Number(grid.opacity ?? 1)))
  const wobble = Math.max(0, Math.min(1, Number(grid.wobble ?? 0)))
  const rotation = ((Number(grid.rotation ?? 0) * Math.PI) / 180)
  const extent = Math.ceil(Math.hypot(width, height))
  const left = -extent / 2
  const top = -extent / 2
  const right = extent / 2
  const bottom = extent / 2
  const distort = (x, y) => {
    if (wobble <= 0) return { x, y }
    const amount = 22 * scale * wobble
    const waveA = Math.sin((x + y * 0.42) / (210 * scale))
    const waveB = Math.cos((y - x * 0.28) / (260 * scale))
    const waveC = Math.sin((x * 0.18 - y * 0.36) / (170 * scale))
    return {
      x: x + (waveA * 0.7 + waveB * 0.3) * amount,
      y: y + (waveB * 0.55 + waveC * 0.35) * amount,
    }
  }

  const drawDistortedLine = (fromX, fromY, toX, toY) => {
    const distance = Math.hypot(toX - fromX, toY - fromY)
    const steps = Math.max(8, Math.ceil(distance / (90 * scale)))
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps
      const point = distort(fromX + (toX - fromX) * t, fromY + (toY - fromY) * t)
      if (i === 0) ctx.moveTo(point.x, point.y)
      else ctx.lineTo(point.x, point.y)
    }
  }

  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate(rotation)
  ctx.globalAlpha = opacity
  ctx.strokeStyle = grid.color
  ctx.fillStyle = grid.color
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'

  if (grid.mode === 'dots') {
    const radius = Math.max(1.5, lineWidth * 1.45)
    for (let x = left + spacing * 0.35; x < right; x += spacing) {
      for (let y = top + spacing * 0.75; y < bottom; y += spacing) {
        const point = distort(x, y)
        ctx.beginPath()
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.restore()
    return
  }

  if (grid.mode === 'stripe-v' || grid.mode === 'stripe-h') {
    const stripeWidth = Math.max(2, lineWidth * 5)
    for (let position = left; position < right; position += spacing) {
      if (wobble <= 0 && grid.mode === 'stripe-v') {
        ctx.fillRect(position, top, stripeWidth, extent)
      } else if (wobble <= 0) {
        ctx.fillRect(left, position, extent, stripeWidth)
      } else {
        ctx.lineWidth = stripeWidth
        ctx.beginPath()
        if (grid.mode === 'stripe-v') drawDistortedLine(position + stripeWidth / 2, top, position + stripeWidth / 2, bottom)
        else drawDistortedLine(left, position + stripeWidth / 2, right, position + stripeWidth / 2)
        ctx.stroke()
      }
    }
    ctx.restore()
    return
  }

  if (grid.mode === 'stripe-diagonal') {
    ctx.lineWidth = Math.max(2, lineWidth * 3)
    for (let x = left - extent; x < right + extent; x += spacing) {
      ctx.beginPath()
      drawDistortedLine(x, bottom, x + extent, top)
      ctx.stroke()
    }
    ctx.restore()
    return
  }

  if (grid.mode === 'dotted') {
    ctx.setLineDash([Math.max(2, lineWidth), Math.round(18 * scale)])
  } else {
    ctx.setLineDash([])
  }

  for (let x = left + spacing * 0.35; x < right; x += spacing) {
    ctx.beginPath()
    if (grid.mode === 'wavy') {
      drawDistortedLine(x, top, x, bottom)
    } else {
      drawDistortedLine(x, top, x, bottom)
    }
    ctx.stroke()
  }

  for (let y = top + spacing * 0.75; y < bottom; y += spacing) {
    ctx.beginPath()
    if (grid.mode === 'wavy') {
      drawDistortedLine(left, y, right, y)
    } else {
      drawDistortedLine(left, y, right, y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function getHandles(layer) {
  return {
    nw: { x: layer.x, y: layer.y },
    ne: { x: layer.x + layer.width, y: layer.y },
    se: { x: layer.x + layer.width, y: layer.y + layer.height },
    sw: { x: layer.x, y: layer.y + layer.height },
  }
}

function getHandleAt(layer, point, size) {
  const handles = getHandles(layer)
  return handleNames.find((name) => {
    const handle = handles[name]
    return Math.abs(point.x - handle.x) <= size && Math.abs(point.y - handle.y) <= size
  })
}

function hitLayer(layer, point) {
  return (
    point.x >= layer.x &&
    point.x <= layer.x + layer.width &&
    point.y >= layer.y &&
    point.y <= layer.y + layer.height
  )
}

function getCanvasSize(format) {
  return { width: format.width, height: format.height }
}

function getImageSlot(format) {
  return { x: 0, y: 0, width: format.width, height: format.height, radius: 0 }
}

function getFrame(template, palette, format) {
  const scale = Math.min(format.width, format.height) / 1080
  const inset = Math.round(template.frameInset * scale)
  return {
    x: inset,
    y: inset,
    width: format.width - inset * 2,
    height: format.height - inset * 2,
    radius: Math.round(template.radius * scale),
    stroke: palette.stroke,
    lineWidth: template.frameWidth > 0 ? Math.max(2, Math.round(template.frameWidth * scale)) : 0,
  }
}

function fitLayerToSlot(img, format, name) {
  const slot = getImageSlot(format)
  const scale = Math.min(slot.width / img.width, slot.height / img.height)
  const width = img.width * scale
  const height = img.height * scale
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    img,
    x: slot.x + slot.width / 2 - width / 2,
    y: slot.y + slot.height / 2 - height / 2,
    width,
    height,
    opacity: 1,
    effects: { ...defaultLayerEffects },
  }
}

function resizeLayer(layer, handle, point, keepRatio = true) {
  const ratio = layer.width / layer.height
  let left = layer.x
  let top = layer.y
  let right = layer.x + layer.width
  let bottom = layer.y + layer.height

  if (handle.includes('w')) left = Math.min(point.x, right - minLayerSize)
  if (handle.includes('e')) right = Math.max(point.x, left + minLayerSize)
  if (handle.includes('n')) top = Math.min(point.y, bottom - minLayerSize)
  if (handle.includes('s')) bottom = Math.max(point.y, top + minLayerSize)

  if (keepRatio) {
    let width = right - left
    let height = bottom - top
    if (width / height > ratio) width = height * ratio
    else height = width / ratio

    if (handle.includes('w')) left = right - width
    else right = left + width
    if (handle.includes('n')) top = bottom - height
    else bottom = top + height
  }

  return {
    ...layer,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  }
}

function createCanvas(width, height) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function createSilhouette(layer, offset, fillColor) {
  const safeOffset = Math.max(0, Math.round(offset))
  const width = Math.max(1, Math.ceil(layer.width + safeOffset * 2))
  const height = Math.max(1, Math.ceil(layer.height + safeOffset * 2))
  const canvas = createCanvas(width, height)
  const maskCtx = canvas.getContext('2d')
  const samples = Math.max(12, Math.ceil(safeOffset * 1.2))

  maskCtx.clearRect(0, 0, width, height)
  maskCtx.drawImage(layer.img, safeOffset, safeOffset, layer.width, layer.height)
  if (safeOffset > 0) {
    for (let i = 0; i < samples; i += 1) {
      const angle = (Math.PI * 2 * i) / samples
      for (const radius of [safeOffset * 0.38, safeOffset * 0.7, safeOffset]) {
        maskCtx.drawImage(
          layer.img,
          safeOffset + Math.cos(angle) * radius,
          safeOffset + Math.sin(angle) * radius,
          layer.width,
          layer.height,
        )
      }
    }
  }

  maskCtx.globalCompositeOperation = 'source-in'
  maskCtx.fillStyle = fillColor
  maskCtx.fillRect(0, 0, width, height)
  maskCtx.globalCompositeOperation = 'source-over'
  return { canvas, x: layer.x - safeOffset, y: layer.y - safeOffset }
}

function drawLayer(ctx, layer) {
  const effects = { ...defaultLayerEffects, ...(layer.effects ?? {}) }
  const offset = Math.max(0, Number(effects.stickerOffset) || 0)

  ctx.save()
  ctx.globalAlpha = layer.opacity ?? 1

  if (offset > 0 || effects.borderEnabled || effects.shadowEnabled) {
    const borderWidth = effects.borderEnabled ? Math.max(2, offset * 0.18) : 0
    const sticker = createSilhouette(layer, offset, effects.stickerColor)
    const border = effects.borderEnabled
      ? createSilhouette(layer, offset + borderWidth, effects.borderColor)
      : null

    if (effects.shadowEnabled && effects.shadowOpacity > 0) {
      ctx.shadowColor = colorWithAlpha(effects.shadowColor, effects.shadowOpacity)
      ctx.shadowBlur = Math.max(6, offset * 1.35)
      ctx.shadowOffsetX = offset * 0.42
      ctx.shadowOffsetY = offset * 0.5
      ctx.drawImage(sticker.canvas, sticker.x, sticker.y)
      ctx.shadowColor = 'transparent'
    }

    if (border) ctx.drawImage(border.canvas, border.x, border.y)
    if (offset > 0) ctx.drawImage(sticker.canvas, sticker.x, sticker.y)
  }

  ctx.drawImage(layer.img, layer.x, layer.y, layer.width, layer.height)
  ctx.restore()
}

function drawCanvas(canvas, template, palette, format, layers, selectedLayerId, settings, showControls = true) {
  const ctx = canvas.getContext('2d')
  const { width, height } = getCanvasSize(format)
  canvas.width = width
  canvas.height = height

  if (isPastelWaveTemplate(template)) {
    drawPastelWaveBase(ctx, width, height, palette, template.solidPastel)
  } else if (template.id === 'soft-poster') {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, palette.gradientFrom)
    gradient.addColorStop(0.52, palette.background)
    gradient.addColorStop(1, palette.gradientTo)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  } else {
    ctx.fillStyle = palette.background
    ctx.fillRect(0, 0, width, height)
  }

  if (template.id === 'editorial-dark') {
    ctx.fillStyle = palette.side ?? 'rgba(255,255,255,0.05)'
    ctx.fillRect(0, 0, width * 0.2, height)
    ctx.fillStyle = palette.side ? palette.side.replace(/0\.0?8|0\.0?7|0\.0?5/, '0.035') : 'rgba(255,255,255,0.025)'
    ctx.fillRect(width * 0.8, 0, width * 0.2, height)
  }

  drawPastelDecorations(ctx, width, height, palette, settings.decoration)

  drawGridOverlay(ctx, width, height, settings.grid)

  if (layers.length === 0) {
    const slot = getImageSlot(format)
    ctx.save()
    ctx.fillStyle = template.id === 'editorial-dark' ? 'rgba(255,255,255,0.18)' : 'rgba(32,36,40,0.26)'
    ctx.textAlign = 'center'
    ctx.font = `600 ${Math.max(22, Math.round(width / 38))}px "Inter", "Yu Gothic", sans-serif`
    ctx.fillText('画像を読み込むとここに配置されます', slot.x + slot.width / 2, slot.y + slot.height / 2)
    ctx.restore()
  }

  layers.forEach((layer) => {
    drawLayer(ctx, layer)
  })

  const frame = getFrame(template, palette, format)
  ctx.save()
  if (frame.lineWidth > 0) {
    ctx.strokeStyle = frame.stroke
    ctx.lineWidth = frame.lineWidth
    roundRect(ctx, frame.x, frame.y, frame.width, frame.height, frame.radius)
    ctx.stroke()
  }
  if (template.id === 'soft-poster') {
    ctx.strokeStyle = 'rgba(46,60,69,0.18)'
    ctx.lineWidth = Math.max(1, Math.round(frame.lineWidth / 2))
    const innerGap = Math.round(frame.lineWidth * (template.innerFrameGapMultiplier ?? 2.6))
    const innerRadius = Math.max(frame.radius * 0.55, frame.radius - innerGap * 0.45)
    roundRect(ctx, frame.x + innerGap, frame.y + innerGap, frame.width - innerGap * 2, frame.height - innerGap * 2, innerRadius)
    ctx.stroke()
  }
  ctx.restore()

  if (isPastelWaveTemplate(template) && !template.solidPastel) {
    drawPastelWaveFrame(ctx, width, height, palette)
  }
  if (template.solidPastel) {
    drawSolidPastelLines(ctx, width, height)
  }

  if (settings.showText) {
    const title = settings.title.trim() || 'WORK TITLE'
    const meta = settings.meta.trim() || 'Illustration / 2026'
    const tag = settings.tag.trim() || '@artist'
    const scale = Math.min(width, height) / 1080
    const pad = Math.round(26 * scale * (template.textInsetMultiplier ?? 1))
    const titleSize = Math.round(42 * scale)
    const metaSize = Math.round(21 * scale)
    const fontFamily = getFontFamily(settings.fontFamily)
    const x = frame.x + pad
    const maxTextWidth = frame.width - pad * 2
    const topTextPad = template.solidPastel ? pad * 1.45 : isPastelWaveTemplate(template) ? pad * 0.34 : pad
    const bottomTextPad = template.solidPastel ? pad * 1.45 : isPastelWaveTemplate(template) ? pad * 0.18 : pad

    ctx.save()
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillStyle = palette.text
    ctx.font = `700 ${titleSize}px ${fontFamily}`
    const titleLineHeight = titleSize * 1.2
    const titleLines = getWrappedLines(ctx, title, maxTextWidth)
    const titleBlockHeight = Math.max(titleLineHeight, titleLines.length * titleLineHeight)
    const isBottomText = settings.textPosition === 'bottom'
    const y = isBottomText
      ? frame.y + frame.height - bottomTextPad - titleBlockHeight
      : frame.y + topTextPad
    const metaY = isBottomText ? y - metaSize * 1.35 : y + titleBlockHeight + titleSize * 0.14

    if (isBottomText) {
      ctx.fillStyle = palette.textMuted
      ctx.font = `500 ${metaSize}px ${fontFamily}`
      ctx.fillText(meta, x, metaY)

      ctx.fillStyle = palette.text
      ctx.font = `700 ${titleSize}px ${fontFamily}`
      titleLines.forEach((line, index) => {
        ctx.fillText(line, x, y + index * titleLineHeight)
      })
    } else {
      titleLines.forEach((line, index) => {
        ctx.fillText(line, x, y + index * titleLineHeight)
      })

      ctx.fillStyle = palette.textMuted
      ctx.font = `500 ${metaSize}px ${fontFamily}`
      ctx.fillText(meta, x, metaY)
    }

    ctx.fillStyle = palette.text
    ctx.font = `700 ${Math.round(19 * scale)}px ${fontFamily}`
    if (isBottomText) {
      const tagSize = Math.round(19 * scale)
      ctx.textAlign = 'right'
      ctx.fillText(tag, frame.x + frame.width - pad, y + titleBlockHeight - tagSize)
    } else {
      ctx.textAlign = 'right'
      ctx.fillText(tag, frame.x + frame.width - pad, y + 4)
    }
    ctx.restore()
  }

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId)
  if (showControls && selectedLayer) {
    ctx.save()
    ctx.strokeStyle = '#2f80ed'
    ctx.lineWidth = 4
    ctx.setLineDash([14, 10])
    ctx.strokeRect(selectedLayer.x, selectedLayer.y, selectedLayer.width, selectedLayer.height)
    ctx.setLineDash([])
    const handleSize = Math.max(14, width / 100)
    const handles = getHandles(selectedLayer)
    Object.values(handles).forEach((handle) => {
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#2f80ed'
      ctx.lineWidth = 4
      ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize)
      ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize)
    })
    ctx.restore()
  }
}

function App() {
  const [formatId, setFormatId] = useState(formatPresets[0].id)
  const [templateId, setTemplateId] = useState(templates[0].id)
  const [paletteIdByTemplate, setPaletteIdByTemplate] = useState(() =>
    Object.fromEntries(templates.map((item) => [item.id, item.palettes[0].id])),
  )
  const [layersState, setLayersState] = useState([])
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [activeInspectorTab, setActiveInspectorTab] = useState('layers')
  const [fontReadyVersion, setFontReadyVersion] = useState(0)
  const [settings, setSettings] = useState({
    title: 'Sample Work',
    meta: 'Illustration / Client work',
    tag: '@artistname',
    showText: true,
    fontFamily: 'system',
    textPosition: 'top',
    grid: {
      mode: 'none',
      color: 'rgba(154, 190, 222, 0.34)',
      width: 2,
      spacing: 108,
      opacity: 1,
      wobble: 0,
      rotation: 0,
    },
    decoration: {
      enabled: false,
      mode: 'cross',
      opacity: 0.62,
      scale: 1,
      sizeVariance: 0.35,
      seed: 1,
    },
  })
  const [interaction, setInteraction] = useState(null)
  const canvasRef = useRef(null)
  const fileRef = useRef(null)

  const template = useMemo(
    () => templates.find((item) => item.id === templateId) ?? templates[0],
    [templateId],
  )
  const palette = useMemo(
    () => template.palettes.find((item) => item.id === paletteIdByTemplate[template.id]) ?? template.palettes[0],
    [template, paletteIdByTemplate],
  )
  const format = useMemo(
    () => formatPresets.find((item) => item.id === formatId) ?? formatPresets[0],
    [formatId],
  )

  const selectedLayer = layersState.find((layer) => layer.id === selectedLayerId) ?? null

  useEffect(() => {
    if (!document.fonts?.ready) return
    document.fonts.ready.then(() => setFontReadyVersion((current) => current + 1))
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    drawCanvas(canvasRef.current, template, palette, format, layersState, selectedLayerId, settings, true)
  }, [template, palette, format, layersState, selectedLayerId, settings, fontReadyVersion])

  function updateText(key, value) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  function updateGrid(patch) {
    setSettings((current) => ({ ...current, grid: { ...current.grid, ...patch } }))
  }

  function applyGridPreset(mode) {
    updateGrid({ mode, wobble: mode === 'wavy' ? 0.8 : 0 })
  }

  function updateDecoration(patch) {
    setSettings((current) => ({ ...current, decoration: { ...current.decoration, ...patch } }))
  }

  function changePalette(nextPaletteId) {
    const nextPalette = template.palettes.find((item) => item.id === nextPaletteId)
    if (!nextPalette) return
    setPaletteIdByTemplate((current) => ({ ...current, [template.id]: nextPalette.id }))
    setSettings((current) => ({
      ...current,
      grid: {
        ...current.grid,
        color: nextPalette.grid ?? current.grid.color,
      },
    }))
  }

  function changeTemplate(nextTemplateId) {
    const nextTemplate = templates.find((item) => item.id === nextTemplateId)
    const nextPaletteId = paletteIdByTemplate[nextTemplateId] ?? nextTemplate?.palettes[0]?.id
    const nextPalette = nextTemplate?.palettes.find((item) => item.id === nextPaletteId) ?? nextTemplate?.palettes[0]
    const isSolidPastel = Boolean(nextTemplate?.solidPastel)
    const isPastel = nextTemplate?.id === 'pastel-grid' || nextTemplate?.pastelWave
    setTemplateId(nextTemplateId)
    setSettings((current) => ({
      ...current,
      grid: {
        ...current.grid,
        mode: isSolidPastel ? 'dotted' : isPastel ? 'wavy' : 'none',
        width: isSolidPastel ? 5 : current.grid.width,
        spacing: isSolidPastel ? 150 : current.grid.spacing,
        opacity: isSolidPastel ? 1 : current.grid.opacity,
        wobble: isSolidPastel ? 0 : isPastel ? 0.8 : 0,
        rotation: isSolidPastel ? 0 : current.grid.rotation,
        color: nextPalette?.grid ?? current.grid.color,
      },
      decoration: {
        ...current.decoration,
        enabled: isPastel ? true : current.decoration.enabled,
        opacity: isSolidPastel ? 1 : current.decoration.opacity,
      },
    }))
  }

  function changeFormat(nextFormatId) {
    const nextFormat = formatPresets.find((item) => item.id === nextFormatId)
    if (!nextFormat || nextFormat.id === formatId) return
    const scaleX = nextFormat.width / format.width
    const scaleY = nextFormat.height / format.height
    setLayersState((current) =>
      current.map((layer) => {
        const centerX = (layer.x + layer.width / 2) * scaleX
        const centerY = (layer.y + layer.height / 2) * scaleY
        return {
          ...layer,
          x: centerX - layer.width / 2,
          y: centerY - layer.height / 2,
        }
      }),
    )
    setFormatId(nextFormat.id)
  }

  function updateSelectedLayer(patch) {
    if (!selectedLayerId) return
    setLayersState((current) =>
      current.map((layer) => (layer.id === selectedLayerId ? { ...layer, ...patch } : layer)),
    )
  }

  function updateSelectedLayerEffects(patch) {
    if (!selectedLayerId) return
    setLayersState((current) =>
      current.map((layer) =>
        layer.id === selectedLayerId
          ? { ...layer, effects: { ...defaultLayerEffects, ...(layer.effects ?? {}), ...patch } }
          : layer,
      ),
    )
  }

  function applySelectedEffectsToAllLayers() {
    if (!selectedLayer) return
    const effects = { ...defaultLayerEffects, ...(selectedLayer.effects ?? {}) }
    setLayersState((current) => current.map((layer) => ({ ...layer, effects: { ...effects } })))
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith('image/'))
    if (files.length === 0) return

    const nextLayers = []
    for (const file of files) {
      const url = URL.createObjectURL(file)
      const img = await new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
        image.src = url
      })
      nextLayers.push(fitLayerToSlot(img, format, file.name.replace(/\.[^.]+$/, '')))
    }

    setLayersState((current) => [...current, ...nextLayers])
    setSelectedLayerId(nextLayers[nextLayers.length - 1].id)
  }

  function resetSelectedPlacement() {
    if (!selectedLayer) return
    const fitted = fitLayerToSlot(selectedLayer.img, format, selectedLayer.name)
    updateSelectedLayer({
      x: fitted.x,
      y: fitted.y,
      width: fitted.width,
      height: fitted.height,
      opacity: 1,
    })
  }

  function deleteSelectedLayer() {
    if (!selectedLayerId) return
    setLayersState((current) => current.filter((layer) => layer.id !== selectedLayerId))
    setSelectedLayerId(null)
  }

  function moveSelectedLayer(direction) {
    if (!selectedLayerId) return
    setLayersState((current) => {
      const index = current.findIndex((layer) => layer.id === selectedLayerId)
      const targetIndex = index + direction
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) return current
      const copy = [...current]
      const [layer] = copy.splice(index, 1)
      copy.splice(targetIndex, 0, layer)
      return copy
    })
  }

  async function exportPng() {
    const canvas = canvasRef.current
    if (!canvas) return
    await document.fonts?.ready
    drawCanvas(canvas, template, palette, format, layersState, selectedLayerId, settings, false)
    const link = document.createElement('a')
    const safeTitle = (settings.title.trim() || 'work').replace(/[\\/:*?"<>|]/g, '_')
    link.download = `${safeTitle}_${template.id}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    drawCanvas(canvas, template, palette, format, layersState, selectedLayerId, settings, true)
  }

  function pointerPosition(event) {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * format.width,
      y: ((event.clientY - rect.top) / rect.height) * format.height,
    }
  }

  function onPointerDown(event) {
    const point = pointerPosition(event)
    const currentSelected = layersState.find((layer) => layer.id === selectedLayerId)
    const handleSize = format.width / 55
    if (currentSelected) {
      const handle = getHandleAt(currentSelected, point, handleSize)
      if (handle) {
        setInteraction({ type: 'resize', layerId: currentSelected.id, handle, startLayer: currentSelected })
        event.currentTarget.setPointerCapture(event.pointerId)
        return
      }
    }

    const hit = [...layersState].reverse().find((layer) => hitLayer(layer, point))
    if (hit) {
      setSelectedLayerId(hit.id)
      setInteraction({ type: 'move', layerId: hit.id, startPoint: point, startLayer: hit })
      event.currentTarget.setPointerCapture(event.pointerId)
    } else {
      setSelectedLayerId(null)
    }
  }

  function onPointerMove(event) {
    if (!interaction) return
    const point = pointerPosition(event)

    if (interaction.type === 'move') {
      const dx = point.x - interaction.startPoint.x
      const dy = point.y - interaction.startPoint.y
      setLayersState((current) =>
        current.map((layer) =>
          layer.id === interaction.layerId
            ? { ...layer, x: interaction.startLayer.x + dx, y: interaction.startLayer.y + dy }
            : layer,
        ),
      )
    }

    if (interaction.type === 'resize') {
      setLayersState((current) =>
        current.map((layer) =>
          layer.id === interaction.layerId
            ? resizeLayer(interaction.startLayer, interaction.handle, point, !event.shiftKey)
            : layer,
        ),
      )
    }
  }

  function onPointerUp() {
    setInteraction(null)
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <h1>Works Layout Tool</h1>
            <p>実績公開用の画像をすばやく整える</p>
          </div>
        </div>

        <section className="panel">
          <div className="section-title">
            <ImagePlus size={17} />
            <span>画像</span>
          </div>
          <input
            ref={fileRef}
            className="hidden-input"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
          />
          <button className="primary-button" onClick={() => fileRef.current?.click()}>
            <ImagePlus size={18} />
            画像を追加
          </button>
          <div
            className="drop-zone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              handleFiles(event.dataTransfer.files)
            }}
          >
            複数画像をまとめてドロップできます
          </div>
        </section>

        <section className="panel">
          <div className="section-title">
            <Move size={17} />
            <span>サイズ</span>
          </div>
          <div className="template-list compact">
            {formatPresets.map((item) => (
              <button
                key={item.id}
                className={`template-button ${item.id === formatId ? 'active' : ''}`}
                onClick={() => changeFormat(item.id)}
              >
                <span>{item.name}</span>
                <small>{item.width} x {item.height} / {item.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-title">
            <Sparkles size={17} />
            <span>プリセット</span>
          </div>
          <div className="template-list">
            {templates.map((item) => (
              <button
                key={item.id}
                className={`template-button ${item.id === templateId ? 'active' : ''}`}
                onClick={() => changeTemplate(item.id)}
              >
                <span>{item.name}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-title">
            <Sparkles size={17} />
            <span>カラー</span>
          </div>
          <div className="palette-list">
            {template.palettes.map((item) => (
              <button
                key={item.id}
                className={`palette-button ${item.id === palette.id ? 'active' : ''}`}
                onClick={() => changePalette(item.id)}
              >
                <span className="swatch" style={{ background: template.solidPastel ? item.background : item.wave ?? item.background }} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </section>

      </aside>

      <section className="stage-wrap">
        <div className="stage-toolbar">
          <div>
            <strong>{template.name}</strong>
            <span>{format.name} / {format.width} x {format.height}px</span>
          </div>
          <button className="ghost-button" onClick={exportPng}>
            <Download size={18} />
            PNG書き出し
          </button>
        </div>
        <div className="canvas-frame">
          <canvas
            ref={canvasRef}
            className={interaction ? 'dragging' : ''}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>
      </section>

      <aside className="inspector">
        <div className="inspector-tabs" role="tablist" aria-label="右パネル">
          {[
            ['layers', 'レイヤー', Layers],
            ['text', '文字', Type],
            ['background', '背景', Sparkles],
          ].map(([tab, label, Icon]) => (
            <button
              key={tab}
              className={activeInspectorTab === tab ? 'active' : ''}
              onClick={() => setActiveInspectorTab(tab)}
              type="button"
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {activeInspectorTab === 'layers' && (
          <>
            <section className="panel">
              <div className="section-title">
                <Layers size={17} />
                <span>レイヤー</span>
              </div>
              <div className="layer-list">
                {[...layersState].reverse().map((layer, visualIndex) => {
                  const realIndex = layersState.length - 1 - visualIndex
                  return (
                    <button
                      key={layer.id}
                      className={`layer-row ${layer.id === selectedLayerId ? 'active' : ''}`}
                      onClick={() => setSelectedLayerId(layer.id)}
                    >
                      <span>{layer.name || '画像' + (realIndex + 1)}</span>
                      <small>{Math.round(layer.width)} x {Math.round(layer.height)}</small>
                    </button>
                  )
                })}
                {layersState.length === 0 && <div className="empty-layers">画像レイヤーはまだありません</div>}
              </div>
              <div className="icon-row">
                <button className="icon-button" title="前面へ" onClick={() => moveSelectedLayer(1)} disabled={!selectedLayer}>
                  <ArrowUp size={17} />
                </button>
                <button className="icon-button" title="背面へ" onClick={() => moveSelectedLayer(-1)} disabled={!selectedLayer}>
                  <ArrowDown size={17} />
                </button>
                <button className="icon-button danger" title="削除" onClick={deleteSelectedLayer} disabled={!selectedLayer}>
                  <Trash2 size={17} />
                </button>
              </div>
            </section>

            <section className="panel">
              <div className="section-title">
                <Move size={17} />
                <span>選択レイヤー</span>
              </div>
              {selectedLayer ? (
                <>
                  <label>
                    背景色
                    <div className="color-row">
                      <input
                        type="color"
                        value={(selectedLayer.effects?.stickerColor ?? defaultLayerEffects.stickerColor).startsWith('#') ? selectedLayer.effects?.stickerColor ?? defaultLayerEffects.stickerColor : '#ffffff'}
                        onChange={(event) => updateSelectedLayerEffects({ stickerColor: event.target.value })}
                      />
                      <input
                        value={selectedLayer.effects?.stickerColor ?? defaultLayerEffects.stickerColor}
                        onChange={(event) => updateSelectedLayerEffects({ stickerColor: event.target.value })}
                      />
                    </div>
                  </label>
                  <label>
                    <span className="range-label">
                      <span>背景オフセット</span>
                      <b>{selectedLayer.effects?.stickerOffset ?? defaultLayerEffects.stickerOffset}</b>
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="1"
                      value={selectedLayer.effects?.stickerOffset ?? defaultLayerEffects.stickerOffset}
                      onChange={(event) => updateSelectedLayerEffects({ stickerOffset: Number(event.target.value) })}
                    />
                  </label>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={selectedLayer.effects?.borderEnabled ?? defaultLayerEffects.borderEnabled}
                      onChange={(event) => updateSelectedLayerEffects({ borderEnabled: event.target.checked })}
                    />
                    <span>枠線を表示</span>
                  </label>
                  <label>
                    枠線色
                    <div className="color-row">
                      <input
                        type="color"
                        value={(selectedLayer.effects?.borderColor ?? defaultLayerEffects.borderColor).startsWith('#') ? selectedLayer.effects?.borderColor ?? defaultLayerEffects.borderColor : '#ffffff'}
                        onChange={(event) => updateSelectedLayerEffects({ borderColor: event.target.value })}
                      />
                      <input
                        value={selectedLayer.effects?.borderColor ?? defaultLayerEffects.borderColor}
                        onChange={(event) => updateSelectedLayerEffects({ borderColor: event.target.value })}
                      />
                    </div>
                  </label>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={selectedLayer.effects?.shadowEnabled ?? defaultLayerEffects.shadowEnabled}
                      onChange={(event) => updateSelectedLayerEffects({ shadowEnabled: event.target.checked })}
                    />
                    <span>シャドウを表示</span>
                  </label>
                  <label>
                    シャドウ色
                    <div className="color-row">
                      <input
                        type="color"
                        value={(selectedLayer.effects?.shadowColor ?? defaultLayerEffects.shadowColor).startsWith('#') ? selectedLayer.effects?.shadowColor ?? defaultLayerEffects.shadowColor : '#8aa0bc'}
                        onChange={(event) => updateSelectedLayerEffects({ shadowColor: event.target.value })}
                      />
                      <input
                        value={selectedLayer.effects?.shadowColor ?? defaultLayerEffects.shadowColor}
                        onChange={(event) => updateSelectedLayerEffects({ shadowColor: event.target.value })}
                      />
                    </div>
                  </label>
                  <label>
                    <span className="range-label">
                      <span>シャドウ不透明度</span>
                      <b>{Math.round((selectedLayer.effects?.shadowOpacity ?? defaultLayerEffects.shadowOpacity) * 100)}%</b>
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedLayer.effects?.shadowOpacity ?? defaultLayerEffects.shadowOpacity}
                      onChange={(event) => updateSelectedLayerEffects({ shadowOpacity: Number(event.target.value) })}
                    />
                  </label>
                  <button className="secondary-button" onClick={applySelectedEffectsToAllLayers}>
                    この効果を全レイヤーへ適用
                  </button>
                  <button className="secondary-button" onClick={resetSelectedPlacement}>
                    <RotateCcw size={17} />
                    選択画像をフィット
                  </button>
                </>
              ) : (
                <div className="empty-layers">キャンバスかレイヤー一覧から画像を選択</div>
              )}
            </section>

            <section className="panel compact-note">
              <div className="section-title">
                <RefreshCcw size={17} />
                <span>操作</span>
              </div>
              <p>画像をクリックすると選択枠が出ます。ドラッグで移動、四隅のハンドルで拡大縮小できます。</p>
              <p>拡大縮小中にShiftを押すと縦横比を固定せず変形できます。</p>
            </section>
          </>
        )}

        {activeInspectorTab === 'text' && (
          <section className="panel">
            <div className="section-title">
              <Type size={17} />
              <span>文字</span>
            </div>
            <button
              className="secondary-button text-toggle"
              onClick={() => updateText('showText', !settings.showText)}
            >
              {settings.showText ? <EyeOff size={17} /> : <Eye size={17} />}
              {settings.showText ? '文字を完全非表示' : '文字を表示'}
            </button>
            <label>
              表示位置
              <div className="segmented text-position-control">
                {[
                  ['top', '上'],
                  ['bottom', '下'],
                ].map(([position, label]) => (
                  <button
                    key={position}
                    type="button"
                    className={settings.textPosition === position ? 'active' : ''}
                    onClick={() => updateText('textPosition', position)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </label>
            <label>
              フォント
              <div className="font-grid">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    className={settings.fontFamily === font.id ? 'active' : ''}
                    style={{ fontFamily: font.family }}
                    onClick={() => updateText('fontFamily', font.id)}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </label>
            <label>
              タイトル
              <input value={settings.title} onChange={(event) => updateText('title', event.target.value)} />
            </label>
            <label>
              補足
              <input value={settings.meta} onChange={(event) => updateText('meta', event.target.value)} />
            </label>
            <label>
              表記
              <input value={settings.tag} onChange={(event) => updateText('tag', event.target.value)} />
            </label>
          </section>
        )}

        {activeInspectorTab === 'background' && (
          <>
            <section className="panel">
              <div className="section-title">
                <Sparkles size={17} />
                <span>グリッド</span>
              </div>
              <div className="segmented">
                {patternModes.map(([mode, label]) => (
                  <button
                    key={mode}
                    className={settings.grid.mode === mode ? 'active' : ''}
                    onClick={() => applyGridPreset(mode)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label>
                色
                <div className="color-row">
                  <input
                    type="color"
                    value={settings.grid.color.startsWith('#') ? settings.grid.color : '#9abede'}
                    onChange={(event) => updateGrid({ color: event.target.value })}
                  />
                  <input
                    value={settings.grid.color}
                    onChange={(event) => updateGrid({ color: event.target.value })}
                  />
                </div>
              </label>
              <label>
                <span className="range-label">
                  <span>太さ</span>
                  <b>{settings.grid.width}</b>
                </span>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={settings.grid.width}
                  onChange={(event) => updateGrid({ width: Number(event.target.value) })}
                />
              </label>
              <label>
                <span className="range-label">
                  <span>細かさ</span>
                  <b>{settings.grid.spacing}</b>
                </span>
                <input
                  type="range"
                  min="48"
                  max="180"
                  step="4"
                  value={settings.grid.spacing}
                  onChange={(event) => updateGrid({ spacing: Number(event.target.value) })}
                />
              </label>
              <label>
                <span className="range-label">
                  <span>不透明度</span>
                  <b>{Math.round((settings.grid.opacity ?? 1) * 100)}%</b>
                </span>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.01"
                  value={settings.grid.opacity ?? 1}
                  onChange={(event) => updateGrid({ opacity: Number(event.target.value) })}
                />
              </label>
              <label>
                <span className="range-label">
                  <span>揺らぎ</span>
                  <b>{Math.round((settings.grid.wobble ?? 0) * 100)}%</b>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.grid.wobble ?? 0}
                  onChange={(event) => updateGrid({ wobble: Number(event.target.value) })}
                />
              </label>
              <label>
                <span className="range-label">
                  <span>回転</span>
                  <b>{settings.grid.rotation ?? 0}°</b>
                </span>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={settings.grid.rotation ?? 0}
                  onChange={(event) => updateGrid({ rotation: Number(event.target.value) })}
                />
              </label>
            </section>

            <section className="panel">
              <div className="section-title">
                <Sparkles size={17} />
                <span>装飾</span>
              </div>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={settings.decoration.enabled}
                  onChange={(event) => updateDecoration({ enabled: event.target.checked })}
                />
                <span>装飾を表示</span>
              </label>
              <div className="segmented decoration-segmented">
                {decorationModes.map(([mode, label]) => (
                  <button
                    key={mode}
                    className={settings.decoration.mode === mode ? 'active' : ''}
                    onClick={() => updateDecoration({ mode, enabled: true })}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label>
                <span className="range-label">
                  <span>不透明度</span>
                  <b>{Math.round((settings.decoration.opacity ?? 0.62) * 100)}%</b>
                </span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={settings.decoration.opacity ?? 0.62}
                  onChange={(event) => updateDecoration({ opacity: Number(event.target.value) })}
                />
              </label>
              <label>
                <span className="range-label">
                  <span>サイズ</span>
                  <b>{Math.round((settings.decoration.scale ?? 1) * 100)}%</b>
                </span>
                <input
                  type="range"
                  min="0.45"
                  max="1.8"
                  step="0.05"
                  value={settings.decoration.scale ?? 1}
                  onChange={(event) => updateDecoration({ scale: Number(event.target.value) })}
                />
              </label>
              <label>
                <span className="range-label">
                  <span>配置シード</span>
                  <b>{settings.decoration.seed ?? 1}</b>
                </span>
                <input
                  type="range"
                  min="1"
                  max="999"
                  step="1"
                  value={settings.decoration.seed ?? 1}
                  onChange={(event) => updateDecoration({ seed: Number(event.target.value) })}
                />
              </label>
              <label>
                <span className="range-label">
                  <span>サイズゆらぎ</span>
                  <b>{Math.round((settings.decoration.sizeVariance ?? 0.35) * 100)}%</b>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.decoration.sizeVariance ?? 0.35}
                  onChange={(event) => updateDecoration({ sizeVariance: Number(event.target.value) })}
                />
              </label>
              <button
                className="secondary-button"
                onClick={() => updateDecoration({ seed: Math.floor(Math.random() * 999) + 1, enabled: true })}
              >
                <RefreshCcw size={17} />
                配置をランダム変更
              </button>
            </section>
          </>
        )}
      </aside>
      <div className="app-credit">Created by MacmazawaRinko</div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
