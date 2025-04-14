import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Box, Typography, Paper } from '@mui/material';

interface ACVDataItem {
    quarter: string;
    type: string;
    acv: number;
}

interface Props {
    data: ACVDataItem[];
}

const colors: Record<string, string> = {
    'Existing Customer': '#1f77b4',
    'New Customer': '#ff7f0e',
};

export const DoughnutChart: React.FC<Props> = ({ data }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data.length || !ref.current) return;

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const width = 500;
        const height = 400;
        const radius = Math.min(width, height) / 2 - 60; // Leave space for labels

        svg
            .attr('width', width)
            .attr('height', height)
            .style('overflow', 'visible'); // prevents label clipping

        const g = svg
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Group by customer type
        const totalByType = d3.rollup(
            data,
            (v) => d3.sum(v, (d) => d.acv),
            (d) => d.type
        );

        const totalACV = Array.from(totalByType.values()).reduce((a, b) => a + b, 0);

        const pie = d3.pie<[string, number]>().value((d) => d[1]);
        const arc = d3.arc<d3.PieArcDatum<[string, number]>>()
            .innerRadius(radius * 0.6)
            .outerRadius(radius);

        const outerArc = d3.arc<d3.PieArcDatum<[string, number]>>()
            .innerRadius(radius * 1.15)
            .outerRadius(radius * 1.15);

        const arcs = g.selectAll('arc')
            .data(pie(Array.from(totalByType.entries())))
            .enter();

        // Chart arcs
        arcs.append('path')
            .attr('d', arc as any)
            .attr('fill', (d) => colors[d.data[0]])
            .attr('stroke', '#fff')
            .style('stroke-width', '2px');

        // Pointer lines
        arcs.append('polyline')
            .attr('points', (d) => {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                const labelX = midAngle < Math.PI ? pos[0] + 20 : pos[0] - 20;
                const points: [number, number][] = [
                    arc.centroid(d),
                    outerArc.centroid(d),
                    [labelX, pos[1]],
                ];
                return points.map((p) => p.join(',')).join(' ');
            })
            .style('fill', 'none')
            .style('stroke', '#999')
            .style('stroke-width', 1);

        // Labels
        arcs.append('text')
            .attr('transform', (d) => {
                const pos = outerArc.centroid(d);
                pos[0] = d.startAngle + (d.endAngle - d.startAngle) / 2 > Math.PI ? pos[0] - 35 : pos[0] + 35;
                return `translate(${pos})`;
            })
            .attr('text-anchor', (d) =>
                d.startAngle + (d.endAngle - d.startAngle) / 2 > Math.PI ? 'end' : 'start'
            )
            .style('font-size', '12px')
            .style('fill', '#000')
            .text((d) => {
                const val = d.data[1];
                return `$${(val / 1000).toFixed(0)}K (${Math.round((val / totalACV) * 100)}%)`;
            });

        // Center Total text
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', -10)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Total');

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 10)
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text(`$${(totalACV / 1000).toFixed(0)}K`);
    }, [data]);

    return (
        <Paper sx={{ p: 2, boxShadow: 'none', border: 'none' }}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ overflow: 'visible' }}
            >
                <svg ref={ref}></svg>
            </Box>
        </Paper>
    );
};
