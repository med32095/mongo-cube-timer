import { LineChart, Line, Tooltip, YAxis, XAxis } from 'recharts';

export default function Chart({ times }) {
    return (
        <div>
            <LineChart width={250} height={150} data={times}>
                <Line 
                    type="monotone"
                    dataKey="time"
                    stroke="#475569"
                    strokeWidth="3"
                    // dot={{ fill: '#94a3b8', stroke: '#94a3b8', strokeWidth: 4 }}
                    dot={false}
                />
                {/* <YAxis interval="preserveStartEnd" stroke='#1e293b'/> */}
                <XAxis reversed={true} hide={true}/>
                <YAxis domain={['dataMin', 'dataMax']} interval="preserveStartEnd" hide={true} />
                <Tooltip />
            </LineChart>
        </div>
    )
}