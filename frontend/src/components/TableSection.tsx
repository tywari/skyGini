import React from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Typography,
    Box,
} from '@mui/material';

interface ACVDataItem {
    quarter: string;
    type: string;
    acv: number;
    opps: number;
}

interface Props {
    data: ACVDataItem[];
}

export const TableSection: React.FC<Props> = ({ data }) => {
    const quarters = Array.from(new Set(data.map((d) => d.quarter)));

    const summary: Record<string, any> = {};
    const totalRow = {
        existing: { acv: 0, opps: 0 },
        new: { acv: 0, opps: 0 },
        total: { acv: 0, opps: 0 },
    };

    quarters.forEach((quarter) => {
        const existing = data.find((d) => d.quarter === quarter && d.type === 'Existing Customer') || { acv: 0, opps: 0 };
        const newCust = data.find((d) => d.quarter === quarter && d.type === 'New Customer') || { acv: 0, opps: 0 };

        const qTotalACV = existing.acv + newCust.acv;
        const qTotalOpps = existing.opps + newCust.opps;

        summary[quarter] = {
            existing,
            newCust,
            total: {
                acv: qTotalACV,
                opps: qTotalOpps,
            },
        };

        totalRow.existing.acv += existing.acv;
        totalRow.existing.opps += existing.opps;
        totalRow.new.acv += newCust.acv;
        totalRow.new.opps += newCust.opps;
        totalRow.total.acv += qTotalACV;
        totalRow.total.opps += qTotalOpps;
    });

    const getPercent = (part: number, total: number) =>
        total === 0 ? '0%' : `${((part / total) * 100).toFixed(0)}%`;

    return (
        <Paper sx={{ mt: 4, p: 2 ,boxShadow: 'none', border: 'none'}} >
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <TableContainer>
                    <Table
                        size="small"
                        sx={{
                            tableLayout: 'fixed',
                            width: '100%',
                            fontSize: '12px',
                            '& th, & td': {
                                padding: '6px',
                                fontSize: '11px',
                                border: '1px solid #ccc',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        background: '#f4f6f8',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        width: '120px',
                                    }}
                                >
                                    Closed fiscal quarter
                                </TableCell>

                                {quarters.map((q, index) => (
                                    <TableCell
                                        key={q}
                                        colSpan={3}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#1976d2' : '#3c7dbd',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {q}
                                    </TableCell>
                                ))}

                                <TableCell colSpan={3} sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold' }}>
                                    Total
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell  sx={{ fontWeight: 'bold', background: '#f4f6f8' }}>
                                    Cust Type
                                </TableCell>
                                {[...quarters, 'Total'].flatMap(() => [
                                    <TableCell key={Math.random()}># of Opps</TableCell>,
                                    <TableCell key={Math.random()}>ACV</TableCell>,
                                    <TableCell key={Math.random()}>% of Total</TableCell>,
                                ])}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {['Existing Customer', 'New Customer'].map((type) => (
                                <TableRow key={type}>
                                    <TableCell>{type}</TableCell>
                                    {quarters.map((q) => {
                                        const row = summary[q];
                                        const item = type === 'Existing Customer' ? row.existing : row.newCust;
                                        const totalACV = Math.round(row.total.acv);

                                        return (
                                            <>
                                                <TableCell>{item.opps}</TableCell>
                                                <TableCell>${Math.round(item.acv).toLocaleString()}</TableCell>
                                                <TableCell>{getPercent(item.acv, totalACV)}</TableCell>
                                            </>
                                        );
                                    })}
                                    <>
                                        <TableCell>{totalRow[type === 'Existing Customer' ? 'existing' : 'new'].opps}</TableCell>
                                        <TableCell>
                                            ${Math.round(totalRow[type === 'Existing Customer' ? 'existing' : 'new'].acv).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {getPercent(
                                                totalRow[type === 'Existing Customer' ? 'existing' : 'new'].acv,
                                                totalRow.total.acv
                                            )}
                                        </TableCell>
                                    </>
                                </TableRow>
                            ))}

                            {/* TOTAL ROW */}
                            <TableRow sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                {quarters.map((q) => {
                                    const total = summary[q].total;
                                    return (
                                        <>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{total.opps}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>${Math.round(total.acv).toLocaleString()}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>100%</TableCell>
                                        </>
                                    );
                                })}
                                <>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{totalRow.total.opps}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>${Math.round(totalRow.total.acv).toLocaleString()}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>100%</TableCell>
                                </>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Paper>
    );
};
