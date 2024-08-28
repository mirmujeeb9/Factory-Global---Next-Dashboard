"use client";

import {
  getRecommendationScoreOverTime,
  getWorkersOverTime,
} from "@/actions/brand-data-getters";
import { useKnoStore } from "@/store/zustand";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

type DataPoint = { date: Date; value: number };

const WorkersOverTimeChart = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const data1Label = "Registered workers over time";
  const data2Label = "Recommendation score";

  const [data1, setData1] = useState<DataPoint[]>([]);
  const [data2, setData2] = useState<DataPoint[]>([]);

  const { startDate, endDate } = useKnoStore((state) => ({
    startDate: state.startDate,
    endDate: state.endDate,
  }));

  useEffect(() => {
    const getData = async () => {
      const workersOverTime = await getWorkersOverTime(startDate, endDate);
      const recommendationScoreOverTime = await getRecommendationScoreOverTime(
        startDate,
        endDate
      );

      console.log("Workers over time: ", workersOverTime);

      setData1(workersOverTime);
      setData2(recommendationScoreOverTime);
    };

    getData();
  }, [startDate, endDate]);

  const drawChart = () => {
    if (chartRef.current) {
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const width = chartRef.current.clientWidth - margin.left - margin.right;
      const height = chartRef.current.clientHeight - margin.top - margin.bottom;

      // Clear any existing content inside the div
      d3.select(chartRef.current).selectAll("*").remove();

      // Add a div on top with border top as black, full width, and white background
      d3.select(chartRef.current)
        .append("div")
        .style("background-color", "white")
        .style("width", "100%")
        .style("height", "10px")
        .style("border-top", "1px solid #F4F4F4")
        .style("position", "absolute")
        .style("bottom", "34px");

      // Add legend
      const legend = d3
        .select(chartRef.current)
        .append("div")
        .style("position", "absolute")
        .style("top", "10px")
        .style("left", "10px")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("background-color", "white")
        .style("padding", "5px");

      const legendData = [
        { label: data1Label, color: "#FFB200" },
        { label: data2Label, color: "#FFE29E" },
      ];

      legendData.forEach((item) => {
        const legendItem = legend
          .append("div")
          .style("display", "flex")
          .style("align-items", "center")
          .style("margin-bottom", "5px");

        legendItem
          .append("div")
          .style("width", "10px")
          .style("height", "10px")
          .style("background-color", item.color)
          .style("margin-right", "8px")
          .style("border-radius", "2px");
        legendItem
          .append("span")
          .style("font-size", "14px")
          .style("color", "#8D8D8D")
          .text(item.label);
      });

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define bar width and padding
      const barWidth = 0.3; // Adjust this value to control bar width
      const barPadding = 0.5; // Adjust this value to control bar padding

      const x0 = d3
        .scaleBand()
        // @ts-ignore
        .domain(data1.map((d) => d.date))
        .range([0, width])
        .padding(barPadding);

      const x1 = d3
        .scaleBand()
        .domain(["data1", "data2"])
        .range([0, x0.bandwidth()])
        .padding(barWidth); // Make bars thinner

      const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
      const xAxis = d3.axisBottom(x0).tickFormat((domainValue, index) => {
        const date = new Date(domainValue);
        return d3.timeFormat("%b, %y")(date);
      });
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("fill", "#8D8D8D"); // Change x label colors to 8D8D8D
      svg
        .append("g")
        .selectAll("g")
        .data(data1)
        .enter()
        .append("g")
        // @ts-ignore
        .attr("transform", (d) => `translate(${x0(d.date)},0)`)
        .selectAll("rect")
        .data((d) => [
          { key: "data1", value: d.value },
          {
            key: "data2",
            value: data2.find((e) => e.date.getTime() === d.date.getTime())
              ?.value,
          },
        ])
        .enter()
        .append("rect")
        .attr("x", (d) => x1(d.key) ?? 0)
        .attr("y", y(0))
        .attr("width", x1.bandwidth())
        .attr("height", 0)
        .attr("fill", (d) => (d.key === "data1" ? "#FFB200" : "#FFE29E"))
        .attr("rx", (d) => (d.value ? 5 : 0)) // Rounded corners only at the top
        .attr("ry", (d) => (d.value ? 5 : 0)) // Rounded corners only at the top
        .on("mouseover", function () {
          d3.select(this).transition().duration(200).style("opacity", 0.7);
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(200).style("opacity", 1);
        })
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d.value as number))
        .attr("height", (d) => height - y(d.value as number))
        .on("end", function (event, d) {
          d3.select(this)
            .attr("data-value", event.value as number) // Store the value in a data attribute
            .each(function () {
              const rect = d3.select(this);
              const parentGroup = d3.select(this.parentNode as Element);
              parentGroup
                .append("foreignObject")
                .attr("x", +rect.attr("x"))
                .attr("y", +rect.attr("y") - 20) // Adjusted to move div above the bar
                .attr("width", x1.bandwidth())
                .attr("height", 20) // Height of the div
                .append("xhtml:div")
                .style("width", "100%")
                .style("height", "100%")
                .style("display", "flex")
                .style("align-items", "center")
                .style("justify-content", "center")
                .style("font-size", "10px") // Reduced text size
                .style("font-weight", "bold") // Make text bold
                .text(event.value !== undefined ? event.value.toString() : ""); // Add content text inside the div
            });
        });
      // Remove ticks and axis line, leaving only the labels
      svg.selectAll(".tick line").remove();
      svg.selectAll(".domain").remove();
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      drawChart();
    }
  }, [data1, data2]);

  return (
    <div
      className="relative h-full w-full max-w-full max-h-full overflow-auto"
      ref={chartRef}
    ></div>
  );
};

export default WorkersOverTimeChart;
