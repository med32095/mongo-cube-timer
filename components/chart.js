import { LineChart, Line, Tooltip } from 'recharts';

export default function Chart({ times }) {
    return (
        <div>
            <LineChart width={100} height={100} data={times}>
                <Line type="monotone" dataKey="time" stroke="#475569" strokeWidth="3" dot={{ fill: '#94a3b8', stroke: '#94a3b8', strokeWidth: 4 }}/>
                <Tooltip />
            </LineChart>
        </div>
    )
}