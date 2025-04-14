import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { CustomerTypeData } from './Dashboard';

interface Props {
    data: CustomerTypeData[];
}

const formatYAxisTick = (value: number): string => {
    return value >= 1_000_000
        ? `$${(value / 1_000_000).toFixed(1)}M`
        : `$${Math.round(value / 1_000)}K`;
};

const formatBarLabel = (value: number): string => {
    return `${Math.round(value / 1000)}K`;
};

export const StackedBarChart: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = 600;
        const height = 400;
        const margin = { top: 50, right: 30, bottom: 70, left: 70 };

        svg.attr('width', width).attr('height', height);

        const grouped = d3.group(data, d => d.quarter);
        const quarters = Array.from(grouped.keys()).sort();

        const color = d3.scaleOrdinal<string>()
            .domain(['Existing Customer', 'New Customer'])
            .range(['#1976d2', '#f57c00']);

        const x = d3.scaleBand()
            .domain(quarters)
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const maxACV = d3.max(quarters, q =>
            d3.sum(grouped.get(q) || [], d => d.acv)
        ) || 0;

        const y = d3.scaleLinear()
            .domain([0, maxACV])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const chart = svg.append('g');

        // X Axis
        chart.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        // Y Axis with custom formatting
        chart.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(8).tickFormat(d => formatYAxisTick(+d)));

        // Bars
        quarters.forEach(q => {
            let yOffset = height - margin.bottom;
            const quarterData = (grouped.get(q) || []).sort(d => d.type === 'New Customer' ? 1 : -1);
            const total = d3.sum(quarterData, d => d.acv);

            quarterData.forEach(d => {
                const barHeight = y(0) - y(d.acv);

                chart.append('rect')
                    .attr('x', x(q)!)
                    .attr('y', yOffset - barHeight)
                    .attr('width', x.bandwidth())
                    .attr('height', barHeight)
                    .attr('fill', color(d.type)!);

                chart.append('text')
                    .attr('x', x(q)! + x.bandwidth() / 2)
                    .attr('y', yOffset - barHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#fff')
                    .style('font-size', '11px')
                    .text(`${formatBarLabel(d.acv)} (${Math.round((d.acv / total) * 100)}%)`);

                yOffset -= barHeight;
            });

            chart.append('text')
                .attr('x', x(q)! + x.bandwidth() / 2)
                .attr('y', y(total) - 10)
                .attr('text-anchor', 'middle')
                .attr('fill', '#000')
                .style('font-size', '13px')
                .style('font-weight', 'bold')
                .text(formatBarLabel(total));
        });
    }, [data]);

    return (
        <Paper sx={{ p: 2,boxShadow: 'none', border: 'none' }}>

            <Box>
                <svg ref={svgRef}></svg>

                <Typography
                    variant="subtitle2"
                    align="center"
                >
                    Closed Fiscal Quarter
                </Typography>

                <Stack
                    direction="row"
                    spacing={4}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2 }}
                >
                    <Stack direction="row" alignItems="start" spacing={1}>
                        <Box width={16} height={16} bgcolor="#1976d2" borderRadius={0.5} />
                        <Typography variant="body2" align="left">Existing Customer</Typography>
                    </Stack>

                    <Stack direction="row" alignItems="end" spacing={1}>
                        <Box width={16} height={16} bgcolor="#f57c00" borderRadius={0.5} />
                        <Typography variant="body2">New Customer</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    );
};
