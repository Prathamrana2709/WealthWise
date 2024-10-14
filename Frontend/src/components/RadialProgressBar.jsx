import React from 'react'
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts'; // Removed BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend

function RadialProgressBar({data}) {    // Changed from RadialProgressBar to RadialProgressBar(props.data)
  
  const {name, value, fill} = data;

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                barSize={20}
                startAngle={90}
                endAngle={(180 + (data.value * 3.6))} // Makes it a full circle
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                  // label={{ fill: '#fff', position: 'insideStart' }}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
    </div>
  )
}

export default RadialProgressBar
