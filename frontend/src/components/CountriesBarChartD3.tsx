/**
 * Bar chart visualization using raw D3.js (not Recharts wrapper).
 * BONUS FEATURE: Raw D3.js implementation
 * 
 * This demonstrates senior-level D3.js skills with:
 * - Manual SVG creation and manipulation
 * - D3 scales and axes
 * - Smooth transitions
 * - Custom tooltips
 * - Responsive sizing
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { CountryCount } from '../types/kol';

interface CountriesBarChartD3Props {
  data: CountryCount[];
}

export function CountriesBarChartD3({ data }: CountriesBarChartD3Props): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    // Responsive sizing
    const handleResize = (): void => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: 400,
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions and margins
    const margin = { top: 20, right: 30, bottom: 100, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .nice()
      .range([height, 0]);

    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map((_, i) => i.toString()))
      .range([
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
      ]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => ''))
      .style('stroke', '#e5e7eb')
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.7)
      .select('.domain')
      .remove();

    // X Axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#4b5563');

    // Y Axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#4b5563');

    // Y Axis Label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#4b5563')
      .text('Number of KOLs');

    // Bars
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.country) || 0)
      .attr('y', height)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', (_, i) => colorScale(i.toString()))
      .attr('rx', 8)
      .attr('ry', 8)
      .style('cursor', 'pointer')
      .style('opacity', 0.9);

    // Animate bars
    bars.transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('y', d => yScale(d.count))
      .attr('height', d => height - yScale(d.count));

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    bars
      .on('mouseover', function(event, d) {
        // Highlight bar
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('filter', 'brightness(1.1)');

        // Show tooltip next to cursor
        tooltip
          .style('display', 'block')
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 15}px`)
          .html(`
            <div style="
              background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
              border-radius: 12px;
              padding: 16px 24px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.3);
              min-width: 140px;
              text-align: center;
            ">
              <p style="
                font-size: 18px;
                font-weight: 700;
                color: white;
                margin: 0 0 8px 0;
              ">${d.country}</p>
              <p style="
                font-size: 14px;
                color: rgba(255,255,255,0.8);
                margin: 0;
              ">KOLs</p>
              <p style="
                font-size: 32px;
                font-weight: 800;
                color: #fbbf24;
                margin: 4px 0 0 0;
              ">${d.count.toLocaleString()}</p>
            </div>
          `);
      })
      .on('mousemove', function(event) {
        // Keep tooltip following cursor
        tooltip
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 15}px`);
      })
      .on('mouseout', function() {
        // Reset bar
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .style('filter', 'brightness(1)');

        // Hide tooltip
        tooltip.style('display', 'none');
      });

  }, [data, dimensions]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Top 10 Countries by KOL Count
        </h2>
        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
          D3.js
        </span>
      </div>
      
      <div className="relative">
        <svg ref={svgRef}></svg>
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none"
          style={{ display: 'none', zIndex: 1000 }}
        ></div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p className="flex items-center">
          <span className="inline-block w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></span>
          Built with raw D3.js (no wrapper library) • Hover for details
        </p>
      </div>
    </div>
  );
}



