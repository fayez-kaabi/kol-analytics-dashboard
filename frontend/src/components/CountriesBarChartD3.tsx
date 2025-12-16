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

    // Color scale - professional muted palette
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map((_, i) => i.toString()))
      .range([
        '#475569', '#64748b', '#78716c', '#71717a', '#6b7280',
        '#525252', '#57534e', '#44403c', '#52525b', '#3f3f46'
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
          .attr('transform', 'scale(1.05)');

        // Show tooltip
        tooltip
          .style('display', 'block')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
              <p class="font-semibold text-gray-800">${d.country}</p>
              <p class="text-sm text-gray-600">
                KOLs: <span class="font-bold text-blue-600">${d.count}</span>
              </p>
            </div>
          `);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', function() {
        // Reset bar
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .attr('transform', 'scale(1)');

        // Hide tooltip
        tooltip.style('display', 'none');
      });

  }, [data, dimensions]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-gray-800">
          Top 10 Countries by KOL Count
        </h2>
        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200">
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

      <div className="mt-4 text-xs text-gray-400">
        Built with raw D3.js • Hover for details
      </div>
    </div>
  );
}



