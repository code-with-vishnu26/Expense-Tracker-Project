import styled from "styled-components";

export const MainLayout=styled.div`
    padding: 2rem;
    height: 100%;
    display: flex;
    gap:2rem;
    @media (max-width: 768px) {
        padding: 1rem;
        padding-top: 4rem;
        gap: 0;
    }
`;

export const InnerLayout = styled.div`
    padding: 2rem 1.5rem;
    width: 100%;
    @media (max-width: 768px) {
        padding: 1rem 0.5rem;
    }
`