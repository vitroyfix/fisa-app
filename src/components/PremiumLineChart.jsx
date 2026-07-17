// src/components/PremiumLineChart.jsx
//
// Redesigned chart — Dribbble / Binance aesthetic:
//   ✅ Y-axis price labels (left side)
//   ✅ X-axis time labels (bottom)
//   ✅ Horizontal gridlines
//   ✅ Dark tooltip popup on scrub (date + price + green dot)
//   ✅ Thin precise line (not thick/wavy)
//   ✅ Subtle gradient fill
//   ✅ Animated draw-on on mount / data change
//   ✅ Live dot at latest price point
//   ✅ Touch-to-scrub with PanResponder

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
  G,
  Text as SvgText,
  Rect,
  ClipPath,
} from 'react-native-svg';
import colors from '../constants/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Layout constants ─────────────────────────────────────────────────────────
const PAD = {
  top:    12,
  bottom: 28,  // room for X-axis labels
  left:   58,  // room for Y-axis labels
  right:  14,  // enough room for the live dot (r=6) at the last point
};
const Y_STEPS    = 5;   // number of horizontal gridlines
const TENSION    = 0.0; // 0 = straight segments (realistic market look), 0.15 = slight curve

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Map raw values → SVG pixel coordinates */
function normalizePoints(data, chartW, chartH) {
  const max  = Math.max(...data);
  const min  = Math.min(...data);
  const range = max - min || 1;
  const innerW = chartW - PAD.left - PAD.right;
  const innerH = chartH - PAD.top  - PAD.bottom;

  return data.map((v, i) => ({
    x:     PAD.left + (i / (data.length - 1)) * innerW,
    y:     PAD.top  + innerH * (1 - (v - min) / range),
    value: v,
    index: i,
  }));
}

/** Build smooth (or straight) SVG path string */
function buildLinePath(points, tension = TENSION) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  if (tension === 0) {
    // Straight line segments — most realistic for market charts
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x.toFixed(2)},${points[i].y.toFixed(2)}`;
    }
  } else {
    for (let i = 0; i < points.length - 1; i++) {
      const c  = points[i];
      const n  = points[i + 1];
      const dx = (n.x - c.x) * tension;
      d += ` C ${(c.x + dx).toFixed(2)},${c.y.toFixed(2)} ${(n.x - dx).toFixed(2)},${n.y.toFixed(2)} ${n.x.toFixed(2)},${n.y.toFixed(2)}`;
    }
  }
  return d;
}

/** Append fill closure (line down → across → close) */
function buildFillPath(linePath, lastX, bottomY, firstX) {
  return `${linePath} L ${lastX.toFixed(2)},${bottomY.toFixed(2)} L ${firstX.toFixed(2)},${bottomY.toFixed(2)} Z`;
}

/** Nice rounded Y-axis values */
function niceSteps(min, max, steps) {
  const range = max - min || 1;
  const raw   = range / steps;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const nice  = Math.ceil(raw / magnitude) * magnitude;
  const start = Math.floor(min / magnitude) * magnitude;
  return Array.from({ length: steps + 1 }, (_, i) => start + i * nice);
}

/** Format a price value for the Y-axis */
function fmtAxis(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return v.toFixed(2);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PremiumLineChart({
  data,                // number[] — raw price series
  xLabels,             // string[] — time labels for X axis (evenly distributed)
  width:   propWidth,  // override width
  height:  propHeight = 200,
  lineColor   = colors.primary,
  showGradient = true,
  showDot      = true,
  showScrubber = true,
  formatValue  = (v) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  formatTooltipDate = (_idx) => 'Today',
}) {
  const chartW = propWidth  ?? SCREEN_W - 32;
  const chartH = propHeight;

  // ── Animated draw-on ───────────────────────────────────────────────────────
  const drawProgress = useRef(new Animated.Value(0)).current;
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (!pathLength) return;
    drawProgress.setValue(0);
    Animated.timing(drawProgress, {
      toValue:         pathLength,
      duration:        900,
      useNativeDriver: false,
    }).start();
  }, [pathLength, data]);

  // ── Scrubber ───────────────────────────────────────────────────────────────
  const [scrubPoint, setScrubPoint] = useState(null);

  const points = normalizePoints(data, chartW, chartH);
  const linePath = buildLinePath(points, TENSION);
  const bottomY  = chartH - PAD.bottom;
  const fillPath = showGradient
    ? buildFillPath(linePath, points[points.length - 1].x, bottomY, points[0].x)
    : null;

  const lastPoint = points[points.length - 1];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => showScrubber,
      onMoveShouldSetPanResponder:  () => showScrubber,
      onPanResponderGrant:  (e) => handleTouch(e.nativeEvent.locationX),
      onPanResponderMove:   (e) => handleTouch(e.nativeEvent.locationX),
      onPanResponderRelease: () => setScrubPoint(null),
    }),
  ).current;

  const handleTouch = useCallback((touchX) => {
    const clamped = Math.max(0, Math.min(touchX, chartW));
    let closest = points[0];
    let minDist  = Math.abs(points[0].x - clamped);
    for (const p of points) {
      const d = Math.abs(p.x - clamped);
      if (d < minDist) { minDist = d; closest = p; }
    }
    setScrubPoint(closest);
  }, [points, chartW]);

  const dashOffset = drawProgress.interpolate({
    inputRange:  [0, Math.max(pathLength, 1)],
    outputRange: [Math.max(pathLength, 1), 0],
  });

  // ── Y-axis grid values ─────────────────────────────────────────────────────
  const dataMin  = Math.min(...data);
  const dataMax  = Math.max(...data);
  const ySteps   = niceSteps(dataMin, dataMax, Y_STEPS);
  const innerH   = chartH - PAD.top - PAD.bottom;
  const range    = dataMax - dataMin || 1;

  function valueToY(v) {
    // Clamp to visible range so labels don't go out of bounds
    const pct = Math.max(0, Math.min(1, (v - dataMin) / range));
    return PAD.top + innerH * (1 - pct);
  }

  // ── Tooltip position ───────────────────────────────────────────────────────
  const tooltipWidth = 130;
  let tooltipLeft = scrubPoint ? scrubPoint.x + 10 : 0;
  if (scrubPoint && tooltipLeft + tooltipWidth > chartW - PAD.right) {
    tooltipLeft = scrubPoint.x - tooltipWidth - 10;
  }
  const tooltipTop = scrubPoint
    ? Math.max(PAD.top, scrubPoint.y - 20)
    : 0;

  return (
    <View style={styles.wrapper}>
      <Svg width={chartW} height={chartH} {...panResponder.panHandlers}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%"   stopColor={lineColor} stopOpacity="0.12" />
            <Stop offset="100%" stopColor={lineColor} stopOpacity="0"    />
          </LinearGradient>
          {/* Hard clip: nothing renders outside the inner plot area */}
          <ClipPath id="plotClip">
            <Rect
              x={PAD.left}
              y={PAD.top}
              width={chartW - PAD.left - PAD.right}
              height={chartH - PAD.top - PAD.bottom}
            />
          </ClipPath>
        </Defs>

        {/* ── Gridlines + Y-axis labels ── */}
        {ySteps.map((v, i) => {
          const y = valueToY(v);
          if (y < PAD.top - 2 || y > chartH - PAD.bottom + 2) return null;
          return (
            <G key={`grid-${i}`}>
              <Line
                x1={PAD.left} y1={y}
                x2={chartW - PAD.right} y2={y}
                stroke={colors.divider ?? '#E5E5E5'}
                strokeWidth="0.8"
                opacity={0.7}
              />
              <SvgText
                x={PAD.left - 5}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                fill={colors.textSecondary ?? '#9a9a9a'}
              >
                {fmtAxis(v)}
              </SvgText>
            </G>
          );
        })}

        {/* ── X-axis labels ── */}
        {xLabels && xLabels.map((label, i) => {
          const idx = Math.round(i * (points.length - 1) / (xLabels.length - 1));
          const pt  = points[Math.min(idx, points.length - 1)];
          const anchor = i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle';
          const xPos   = i === 0 ? PAD.left : i === xLabels.length - 1 ? chartW - PAD.right : pt.x;
          return (
            <SvgText
              key={`xl-${i}`}
              x={xPos}
              y={chartH - PAD.bottom + 14}
              textAnchor={anchor}
              fontSize="10"
              fill={colors.textSecondary ?? '#9a9a9a'}
            >
              {label}
            </SvgText>
          );
        })}

        {/* ── Clipped plot area: fill, line, dots, scrubber line ── */}
        <G clipPath="url(#plotClip)">

          {/* Gradient fill */}
          {showGradient && fillPath && (
            <Path d={fillPath} fill="url(#areaGrad)" />
          )}

          {/* Animated line */}
          <AnimatedPath
            d={linePath}
            fill="none"
            stroke={lineColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength || 9999}
            strokeDashoffset={dashOffset}
          />

          {/* Invisible measuring path */}
          <Path
            d={linePath}
            fill="none"
            stroke="transparent"
            strokeWidth="0"
            ref={(ref) => {
              if (ref && !pathLength) {
                const estimate = points.reduce((acc, p, i) => {
                  if (i === 0) return acc;
                  const prev = points[i - 1];
                  return acc + Math.hypot(p.x - prev.x, p.y - prev.y);
                }, 0);
                if (estimate > 0) setPathLength(estimate * 1.05);
              }
            }}
          />

          {/* Live dot at latest price */}
          {showDot && !scrubPoint && (
            <G>
              <Circle cx={lastPoint.x} cy={lastPoint.y} r={6}   fill={lineColor} opacity={0.18} />
              <Circle cx={lastPoint.x} cy={lastPoint.y} r={3.5} fill={colors.white ?? '#fff'} />
              <Circle cx={lastPoint.x} cy={lastPoint.y} r={2}   fill={lineColor} />
            </G>
          )}

          {/* Scrubber vertical line */}
          {scrubPoint && (
            <Line
              x1={scrubPoint.x} y1={PAD.top}
              x2={scrubPoint.x} y2={bottomY}
              stroke={lineColor}
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity={0.45}
            />
          )}

        </G>

        {/* ── Scrubber dot + tooltip (outside clip so tooltip isn't cut off) ── */}
        {scrubPoint && (
          <G>
            {/* Dot */}
            <Circle cx={scrubPoint.x} cy={scrubPoint.y} r={5} fill={colors.white ?? '#fff'} />
            <Circle
              cx={scrubPoint.x} cy={scrubPoint.y} r={5}
              fill="none"
              stroke={lineColor}
              strokeWidth="2"
            />

            {/* Dark tooltip popup */}
            <Rect
              x={tooltipLeft}
              y={tooltipTop}
              width={tooltipWidth}
              height={38}
              rx={7}
              fill="#1a1a2e"
            />
            <SvgText
              x={tooltipLeft + 9}
              y={tooltipTop + 13}
              fontSize="10"
              fill="rgba(255,255,255,0.55)"
            >
              {formatTooltipDate(scrubPoint.index)}
            </SvgText>
            <Circle
              cx={tooltipLeft + 13}
              cy={tooltipTop + 26}
              r={4}
              fill={lineColor}
            />
            <SvgText
              x={tooltipLeft + 22}
              y={tooltipTop + 30}
              fontSize="12"
              fontWeight="600"
              fill="#ffffff"
            >
              {formatValue(scrubPoint.value)}
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
});