import React from 'react';
import { FunnelChart } from 'react-funnel-pipeline';
import 'react-funnel-pipeline/dist/index.css';

const Funnel = ({ data }) => {
    return (
        <FunnelChart
            data={data}
            style={{ width: '100%', height: '100%'}}
            pallette = {['#3b7dd8', '#4a91f2', '#64a1f4', '#8dbdff', '#bfd6f6']}
        />
    );
};

export default Funnel;