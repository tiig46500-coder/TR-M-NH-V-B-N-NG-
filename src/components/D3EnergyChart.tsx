import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { MoodLogEntry } from "../types";

interface D3EnergyChartProps {
  logs: MoodLogEntry[];
  moodsConfig: Record<string, { emoji: string; label: string; [key: string]: any }>;
}

export const D3EnergyChart: React.FC<D3EnergyChartProps> = ({ logs, moodsConfig }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [width, setWidth] = useState(500);
  const height = 180;

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || logs.length === 0) return;

    // Sort logs ascending by date
    const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

    const margin = { top: 25, right: 30, bottom: 35, left: 35 };
    const chartWidth = Math.max(100, width - margin.left - margin.right);
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Setup scales
    const xScale = d3.scalePoint<string>()
      .domain(sortedLogs.map(d => d.date))
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([1, 5])
      .range([chartHeight, 0]);

    // Format dates for labels
    const formatDayLabel = (dateStr: string) => {
      try {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
          return `${days[d.getDay()]} (${parts[2]}/${parts[1]})`;
        }
      } catch (e) {}
      return dateStr;
    };

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add dynamic colors based on theme
    const isDark = document.body.classList.contains("theme-indigo") || 
                   document.body.classList.contains("theme-moss") || 
                   document.body.classList.contains("dark-theme-indigo") || 
                   document.body.classList.contains("dark-theme-moss");
    
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.06)";
    const textColor = isDark ? "#cbd5e1" : "#475569";
    const accentColor = isDark ? "#34d399" : "#10b981"; // Emerald color
    const axisColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.1)";

    // Add Grid Lines (Horizontal only for energy levels 1 to 5)
    const yGridValues = [1, 2, 3, 4, 5];
    g.selectAll(".y-grid")
      .data(yGridValues)
      .enter()
      .append("line")
      .attr("class", "y-grid")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", gridColor)
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 1);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d => formatDayLabel(d)))
      .call(g => g.select(".domain").attr("stroke", axisColor))
      .call(g => g.selectAll(".tick line").attr("stroke", axisColor))
      .call(g => g.selectAll(".tick text")
        .attr("fill", textColor)
        .style("font-size", "10px")
        .style("font-family", "JetBrains Mono, monospace")
        .attr("dy", "10px")
      );

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5).tickValues([1, 2, 3, 4, 5]).tickFormat(d => `${d}`))
      .call(g => g.select(".domain").attr("stroke", axisColor))
      .call(g => g.selectAll(".tick line").attr("stroke", axisColor))
      .call(g => g.selectAll(".tick text")
        .attr("fill", textColor)
        .style("font-size", "10px")
        .style("font-family", "JetBrains Mono, monospace")
      );

    // Gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "d3-chart-area-gradient")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", accentColor)
      .attr("stop-opacity", isDark ? 0.3 : 0.22);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", accentColor)
      .attr("stop-opacity", 0.0);

    // Line generator
    const lineGenerator = d3.line<MoodLogEntry>()
      .x(d => xScale(d.date) ?? 0)
      .y(d => yScale(d.energyLevel))
      .curve(d3.curveMonotoneX);

    // Area generator
    const areaGenerator = d3.area<MoodLogEntry>()
      .x(d => xScale(d.date) ?? 0)
      .y0(chartHeight)
      .y1(d => yScale(d.energyLevel))
      .curve(d3.curveMonotoneX);

    // Render filled area under the curve
    g.append("path")
      .datum(sortedLogs)
      .attr("class", "area")
      .attr("d", areaGenerator)
      .attr("fill", "url(#d3-chart-area-gradient)");

    // Render smooth curve line
    const path = g.append("path")
      .datum(sortedLogs)
      .attr("class", "line")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", accentColor)
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    // Animate the line drawing
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // Points and hover groups
    const pointsGroup = g.selectAll(".dot-group")
      .data(sortedLogs)
      .enter()
      .append("g")
      .attr("class", "dot-group")
      .attr("transform", d => `translate(${xScale(d.date) ?? 0},${yScale(d.energyLevel)})`)
      .style("cursor", "pointer");

    // White circle outline
    pointsGroup.append("circle")
      .attr("r", 5)
      .attr("fill", isDark ? "#1e293b" : "#ffffff")
      .attr("stroke", accentColor)
      .attr("stroke-width", 2.5);

    // Invisible larger circle for easy hovering
    pointsGroup.append("circle")
      .attr("r", 15)
      .attr("fill", "transparent")
      .on("mouseenter", (event, d) => {
        const index = sortedLogs.findIndex(item => item.id === d.id);
        setHoveredIndex(index);
        d3.select(event.currentTarget.parentNode).select("circle")
          .transition()
          .duration(150)
          .attr("r", 8)
          .attr("stroke-width", 3.5);
      })
      .on("mouseleave", (event, d) => {
        setHoveredIndex(null);
        d3.select(event.currentTarget.parentNode).select("circle")
          .transition()
          .duration(150)
          .attr("r", 5)
          .attr("stroke-width", 2.5);
      });

    // Add emoji above point
    pointsGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -14)
      .style("font-size", "13px")
      .style("user-select", "none")
      .text(d => moodsConfig[d.moodId]?.emoji || "🌟");

  }, [logs, width, moodsConfig]);

  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const activeLog = hoveredIndex !== null ? sortedLogs[hoveredIndex] : null;

  return (
    <div ref={containerRef} className="w-full relative select-none">
      <div className="overflow-x-auto overflow-y-visible">
        <svg ref={svgRef} width={width} height={height} className="overflow-visible min-w-[320px] mx-auto" />
      </div>
      
      {/* Tooltip Overlay */}
      <div className="min-h-[44px] flex items-center justify-center bg-white/40 dark:bg-slate-800/40 p-2.5 rounded-xl border border-white/50 dark:border-slate-700/50 text-[11.5px] text-slate-600 dark:text-slate-300 text-center font-sans mt-3 transition-colors duration-300">
        {activeLog ? (
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {(() => {
                try {
                  const parts = activeLog.date.split("-");
                  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
                  return `${days[d.getDay()]}, Ngày ${parts[2]}/${parts[1]}`;
                } catch (e) {
                  return activeLog.date;
                }
              })()}
            </span>:{" "}
            Tâm trạng <span className="font-bold text-emerald-600 dark:text-emerald-400">{moodsConfig[activeLog.moodId]?.label || "Không rõ"}</span> (Năng lượng {activeLog.energyLevel}/5)
            {activeLog.note && <span className="block text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[280px] sm:max-w-md mx-auto italic">"{activeLog.note}"</span>}
          </div>
        ) : (
          <span className="italic text-slate-400 dark:text-slate-400 flex items-center gap-1.5 justify-center">
            🌱 Rê chuột lên các điểm tròn để xem thông tin năng lượng chi tiết
          </span>
        )}
      </div>
    </div>
  );
};
