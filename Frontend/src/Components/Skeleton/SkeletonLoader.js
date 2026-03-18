import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
`;

const SkeletonPulse = styled.div`
    display: inline-block;
    width: ${props => props.$width || '100%'};
    height: ${props => props.$height || '20px'};
    border-radius: ${props => props.$radius || '8px'};
    background: linear-gradient(
        90deg,
        var(--card-bg, #f0f0f0) 25%,
        var(--card-border, #e0e0e0) 50%,
        var(--card-bg, #f0f0f0) 75%
    );
    background-size: 800px 100%;
    animation: ${shimmer} 1.5s ease-in-out infinite;
`;

/* ===== Preset Skeleton Layouts ===== */

export function KPICardSkeleton() {
    return (
        <SkeletonCard>
            <SkeletonPulse $width="48px" $height="48px" $radius="14px" />
            <div className="sk-info">
                <SkeletonPulse $width="60%" $height="12px" />
                <SkeletonPulse $width="80%" $height="24px" />
                <SkeletonPulse $width="50%" $height="10px" />
            </div>
        </SkeletonCard>
    );
}

export function ChartSkeleton() {
    return (
        <SkeletonChartCard>
            <SkeletonPulse $width="40%" $height="16px" style={{ marginBottom: '1rem' }} />
            <SkeletonPulse $width="100%" $height="220px" $radius="12px" />
        </SkeletonChartCard>
    );
}

export function ListItemSkeleton({ count = 3 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonListItem key={i}>
                    <SkeletonPulse $width="40px" $height="40px" $radius="12px" />
                    <div className="sk-content">
                        <SkeletonPulse $width="60%" $height="14px" />
                        <SkeletonPulse $width="35%" $height="11px" />
                    </div>
                    <SkeletonPulse $width="70px" $height="14px" />
                </SkeletonListItem>
            ))}
        </>
    );
}

export function DashboardSkeleton() {
    return (
        <SkeletonDashboard>
            {/* Header */}
            <div className="sk-header">
                <div>
                    <SkeletonPulse $width="180px" $height="28px" />
                    <SkeletonPulse $width="220px" $height="14px" style={{ marginTop: '8px' }} />
                </div>
                <SkeletonPulse $width="140px" $height="36px" $radius="12px" />
            </div>

            {/* KPI Row */}
            <div className="sk-kpi-row">
                <KPICardSkeleton />
                <KPICardSkeleton />
                <KPICardSkeleton />
                <KPICardSkeleton />
            </div>

            {/* Charts Row */}
            <div className="sk-charts-row">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>
        </SkeletonDashboard>
    );
}

export function PageSkeleton() {
    return (
        <SkeletonPage>
            <SkeletonPulse $width="200px" $height="28px" style={{ marginBottom: '1rem' }} />
            <SkeletonPulse $width="100%" $height="56px" $radius="20px" style={{ marginBottom: '1rem' }} />
            <div className="sk-content-grid">
                <div className="sk-form">
                    <SkeletonPulse $width="100%" $height="300px" $radius="20px" />
                </div>
                <div className="sk-list">
                    <ListItemSkeleton count={4} />
                </div>
            </div>
        </SkeletonPage>
    );
}

/* ===== Styled Containers ===== */

const SkeletonCard = styled.div`
    background: var(--card-bg, #FCF6F9);
    border: 2px solid var(--card-border, #fff);
    border-radius: 16px;
    padding: 1.2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    .sk-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
`;

const SkeletonChartCard = styled.div`
    background: var(--card-bg, #FCF6F9);
    border: 2px solid var(--card-border, #fff);
    border-radius: 20px;
    padding: 1.2rem;
`;

const SkeletonListItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem;
    background: var(--card-bg, #FCF6F9);
    border: 2px solid var(--card-border, #fff);
    border-radius: 14px;
    margin-bottom: 0.6rem;
    .sk-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
`;

const SkeletonDashboard = styled.div`
    .sk-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }
    .sk-kpi-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .sk-charts-row {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 1rem;
    }
    @media (max-width: 768px) {
        .sk-kpi-row { grid-template-columns: repeat(2, 1fr); }
        .sk-charts-row { grid-template-columns: 1fr; }
    }
`;

const SkeletonPage = styled.div`
    .sk-content-grid {
        display: flex;
        gap: 2rem;
    }
    .sk-form { flex: 0 0 40%; }
    .sk-list { flex: 1; }
    @media (max-width: 768px) {
        .sk-content-grid { flex-direction: column; }
    }
`;

export default SkeletonPulse;
