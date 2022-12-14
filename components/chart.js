import { LineChart, Line, Tooltip, YAxis, XAxis } from 'recharts';

export default function Chart({ times }) {
    return (
        <div>
            <LineChart width={350} height={100} data={times}>
                <Line 
                    type="monotone"
                    dataKey="time"
                    stroke="#475569"
                    strokeWidth="3"
                    // dot={{ fill: '#94a3b8', stroke: '#94a3b8', strokeWidth: 4 }}
                    dot={false}
                />
                {/* <YAxis interval="preserveStartEnd" stroke='#1e293b'/> */}
                <XAxis hide={true} reversed={true}/>
                <YAxis domain={['dataMin', 'dataMax']} interval="preserveStartEnd" hide={true} />
                {/* <Tooltip /> */}
            </LineChart>
        </div>
    )
}