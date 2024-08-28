"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

const ValueRing = ({ value }: { value: number }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 150;
    const height = 150;
    const thickness = 2;
    const radius = Math.min(width, height) / 2 - thickness;

    svg.attr("width", width).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const background = g
      .append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#e6e6e6")
      .attr("stroke-width", thickness);

    const getColor = (value: number) => {
      if (value > 80) return "#2DAB00";
      if (value > 30) return "#FFB200";
      return "#FF0000";
    };

    const foreground = g
      .append("path")
      .attr("fill", "none")
      .attr("stroke", getColor(value))
      .attr("stroke-width", thickness)
      .attr("stroke-linecap", "round");

    const arc = d3
      .arc()
      .innerRadius(radius)
      .outerRadius(radius)
      .startAngle(Math.PI / 2);

    const update = (value: number) => {
      const endAngle = (value / 100) * 2 * Math.PI + Math.PI / 2;
      foreground
        .transition()
        .duration(1000)
        .attrTween("d", () => {
          const interpolate = d3.interpolate(Math.PI / 2, endAngle);
          return (t) =>
            // @ts-ignore
            arc({ endAngle: interpolate(t), startAngle: Math.PI / 2 });
        });
    };

    update(value);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "16px")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .text(`${value}%`);

    return () => {
      svg.selectAll("*").remove();
    };
  }, [value]);

  return <svg ref={ref}></svg>;
};

export default ValueRing;
