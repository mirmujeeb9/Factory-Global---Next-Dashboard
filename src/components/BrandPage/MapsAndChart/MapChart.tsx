"use client";

import { getMapData } from "@/actions/brand-data-getters";
import { Skeleton } from "@/components/ui/skeleton";
import custom_geo_json from "@/components/worldmap_50m.geo.json"; // Make sure to have a GeoJSON file for world countries
import { useKnoStore } from "@/store/zustand";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

// Define colors with descriptive names
const selectedCountryFillColor = "#FFB200"; // Color for the selected country
const defaultCountryFillColor = "#F0F0F0"; // Default color for countries
const countryStrokeColor = "#CBCBCB"; // Stroke color for country borders
const hoverFillColor = "#E0E0E0"; // Fill color on hover for non-selected countries
const firstPulsingCircleColor = "#FFDC8C"; // Color for the first pulsing circle
const secondPulsingCircleColor = "#FFDC8C"; // Color for the second pulsing circle
const smallCircleColor = "#C18600"; // Color for the small circle
const backgroundColor = "#FFFFFA"; // Background color for the map container

export interface Country {
  name: string;
  suppliers?: number;
  coordinates: [number, number][];
}

/**
 * MapChart component to render a world map with supplier locations.
 *
 * @param {MapChartProps} props - Component properties.
 */
const MapChart = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [zoomDuration, setZoomDuration] = useState<number>(2000); // State for zoom duration
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>("");

  const { startDate, endDate } = useKnoStore((state) => ({
    startDate: state.startDate,
    endDate: state.endDate,
  }));

  useEffect(() => {
    // Fetch or generate your data here
    const fetchData = async () => {
      const countries = await getMapData(startDate, endDate); // Replace with your data source

      setCountries(countries);
      setSelectedCountry(countries.length > 0 ? countries[0].name : "");
    };

    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const projection = d3
      .geoMercator()
      .scale(100)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    svg.selectAll("*").remove();

    const g = svg.append("g");

    g.selectAll("path")
      // @ts-ignore
      .data(custom_geo_json.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) =>
        d.properties.name === selectedCountry
          ? selectedCountryFillColor
          : defaultCountryFillColor
      )
      .attr("stroke", countryStrokeColor)
      .attr("stroke-width", "0.2")
      .style("transition", "fill 0.1s, opacity 0.1s") // Add transition for fill and opacity
      .on("mouseover", function (event, d: any) {
        if (d.properties.name === selectedCountry) {
          d3.select(this).style("opacity", 0.9).style("cursor", "pointer");
        } else {
          d3.select(this)
            .attr("fill", hoverFillColor)
            .style("cursor", "pointer");
        }
      })
      .on("mouseout", function (event, d: any) {
        if (d.properties.name === selectedCountry) {
          d3.select(this).style("opacity", 1);
        } else {
          d3.select(this).attr("fill", (d: any) =>
            d.properties.name === selectedCountry
              ? selectedCountryFillColor
              : defaultCountryFillColor
          );
        }
      })
      .on("click", (event, d: any) => {
        if (countries.some((country) => country.name === d.properties.name)) {
          setSelectedCountry(d.properties.name);
        }
      });

    // Add supplier dots for the selected country only
    const selectedCountryData = countries.find(
      (country) => country.name === selectedCountry
    );

    if (selectedCountryData && selectedCountryData.coordinates.length > 0) {
      if (selectedCountryData) {
        const supplierGroup = g
          .selectAll(`g.${selectedCountryData.name}`)
          .data(selectedCountryData.coordinates)
          .enter()
          .append("g")
          .attr("class", selectedCountryData.name)
          .attr("transform", (d) => {
            const proj = projection(d);
            return proj ? `translate(${proj[0]}, ${proj[1]})` : null;
          });

        // First pulsing circle
        supplierGroup
          .append("circle")
          .attr("r", 2)
          .attr("fill", firstPulsingCircleColor)
          .attr("opacity", 0.5)
          .transition()
          .duration(1200)
          .ease(d3.easeLinear)
          .attr("r", 10)
          .attr("opacity", 0)
          .on("end", function repeat() {
            d3.select(this)
              .attr("r", 2)
              .attr("opacity", 0.5)
              .transition()
              .duration(1200)
              .ease(d3.easeLinear)
              .attr("r", 10)
              .attr("opacity", 0)
              .on("end", repeat);
          });

        // Second pulsing circle
        supplierGroup
          .append("circle")
          .attr("r", 2)
          .attr("fill", secondPulsingCircleColor)
          .attr("opacity", 0.5)
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("r", 10)
          .attr("opacity", 0)
          .on("end", function repeat() {
            d3.select(this)
              .attr("r", 2)
              .attr("opacity", 0.5)
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .attr("r", 10)
              .attr("opacity", 0)
              .on("end", repeat);
          });

        // Append the small circle last to ensure it remains on top
        supplierGroup
          .append("circle")
          .attr("r", 0.5)
          .attr("fill", smallCircleColor);
      }
    }

    // Add smooth pan and zoom functionality
    const zoom = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

    svg.call(zoom as any);

    // Zoom into the selected country on load
    if (selectedCountry) {
      // @ts-ignore
      const selectedFeature = custom_geo_json.features.find(
        (feature: any) => feature.properties.name === selectedCountry
      );

      if (selectedFeature) {
        // @ts-ignore
        const [[x0, y0], [x1, y1]] = path.bounds(selectedFeature);
        const dx = x1 - x0;
        const dy = y1 - y0;
        const x = (x0 + x1) / 2;
        const y = (y0 + y1) / 2;
        const scale = Math.max(
          1,
          Math.min(8, 0.9 / Math.max(dx / width, dy / height))
        );
        const translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition().duration(zoomDuration).call(
          // @ts-ignore
          zoom.transform,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
      }
    }
  }, [countries, selectedCountry, zoomDuration, startDate, endDate]);

  return (
    <div
      className="relative h-full w-full col-span-1 row-span-1"
      style={{ backgroundColor }}
    >
      {/* Selector for countries */}
      <div className="absolute flex top-2 left-2 w-[200px] h-fit p-2 bg-white rounded-md border-black/[0.1] border-[1px] bg-opacity-25 backdrop-blur-sm">
        <ul className="flex flex-col w-full text-sm">
          <div className="flex w-full items-center justify-between border-b-black/[0.1] text-black/[0.3] border-b-[1px] pb-2 mb-2">
            <span>Country</span>
            <span>Total Suppliers</span>
          </div>
          {countries.length === 0 ? (
            // Skeleton loading state
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, index) => (
                <li
                  key={index}
                  className="w-full flex items-center justify-between animate-pulse"
                >
                  <Skeleton className="bg-gray-300 h-4 w-1/2 rounded" />
                  <Skeleton className="bg-gray-300 h-4 w-[20%] rounded" />
                </li>
              ))}
            </div>
          ) : (
            countries.map((country) => (
              <li
                key={country.name}
                className={`w-full flex items-center justify-between hover:cursor-pointer duration-150 text-black ${
                  country.name === selectedCountry
                    ? "font-semibold opacity-100"
                    : "opacity-30 hover:opacity-70"
                }`}
                onClick={() => setSelectedCountry(country.name)}
              >
                <span>{country.name}</span>
                <span>{country.suppliers}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <svg ref={svgRef} className="h-full w-full"></svg>
    </div>
  );
};

export default MapChart;
