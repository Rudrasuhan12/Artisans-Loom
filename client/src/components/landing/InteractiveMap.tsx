"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface InteractiveMapProps {
  onSelectState: (stateName: string) => void;
}

export default function InteractiveMap({ onSelectState }: InteractiveMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const geoJsonUrl = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const projection = d3.geoMercator()
      .scale(width * 1.2)
      .center([83, 23])
      .translate([width / 2, height / 2]);
    
    const pathGenerator = d3.geoPath().projection(projection);

    d3.json(geoJsonUrl).then((data: any) => {
      svg.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator as any)
        .attr("class", "cursor-pointer transition-colors duration-300 fill-[#EFEAE4] stroke-[#A5805E] stroke-[0.5px] hover:fill-[#D4AF37]/40")
        .on("click", (event, d: any) => {
          svg.selectAll("path").attr("fill", "#EFEAE4");
          d3.select(event.currentTarget).attr("fill", "#D4AF37");
          onSelectState(d.properties.NAME_1);
        });
    });
  }, []);

  return <svg ref={svgRef} className="w-full h-full min-h-[500px]" />;
}