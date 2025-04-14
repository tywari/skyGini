import React, { useEffect, useState } from 'react';
import { Grid, Container, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { StackedBarChart } from './StackedBarChart';
import { DoughnutChart } from './DoughnutChart';
import { TableSection } from './TableSection';

export interface CustomerTypeData {
    quarter: string;
    type: 'Existing Customer' | 'New Customer';
    acv: number;
    opps: number;
}

export interface IndustryData {
    Acct_Industry: string;
    count: number;
    acv: number;
    closed_fiscal_quarter: string;
}

export interface TeamData {
    Team: string;
    count: number;
    acv: number;
    closed_fiscal_quarter: string;
}

export interface AcvRangeData {
    ACV_Range: string;
    count: number;
    acv: number;
    closed_fiscal_quarter: string;
}

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);

    const [customerData, setCustomerData] = useState<CustomerTypeData[]>([]);
    const [industryData, setIndustryData] = useState<IndustryData[]>([]);
    const [teamData, setTeamData] = useState<TeamData[]>([]);
    const [acvRangeData, setAcvRangeData] = useState<AcvRangeData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    customerRes,
                    industryRes,
                    teamRes,
                    acvRangeRes
                ] = await Promise.all([
                    axios.get('http://localhost:3001/api/customer-type'),
                    axios.get('http://localhost:3001/api/account-industry'),
                    axios.get('http://localhost:3001/api/team'),
                    axios.get('http://localhost:3001/api/acv-range')
                ]);

                // Transform Customer Type data for charting
                const formattedCustomerData = customerRes.data.map((d: any) => ({
                    quarter: d.closed_fiscal_quarter,
                    type: d.Cust_Type,
                    acv: d.acv,
                    opps:d.count
                }));

                setCustomerData(formattedCustomerData);
                setIndustryData(industryRes.data);
                setTeamData(teamRes.data);
                setAcvRangeData(acvRangeRes.data);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Grid container justifyContent="center" mt={5}>
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h6" align="center" gutterBottom>
                Won Acv mix by cust type
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <StackedBarChart data={customerData} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DoughnutChart data={customerData} />
                </Grid>
                <Grid item xs={12}>
                    <TableSection data={customerData} />
                </Grid>
            </Grid>
        </Container>
    );
};

