import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

const ExpenseActivityCard = ({status , data}) => {
  if (status) {
    return <Card title="Expense Activity" moreOptions={true} className="h-full text-black">
    <div className="flex items-center mb-4">
      <div className="flex items-center mr-4">
        <div className={`w-3 h-0.5 bg-red-800 mr-1`}></div>
        <span className="text-xs text-gray-500">Actual expenses</span>
      </div>
    </div>
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{
        top: 5,
        right: 20,
        left: 0,
        bottom: 5,
      }}>
          <CartesianGrid vertical={false} stroke="#f5f5f5" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
          fontSize: 10
        }} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={value => `${value / 1000}k`} tick={{
          fontSize: 10
        }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="red" strokeWidth={2} dot={{
          stroke: 'red',
          strokeWidth: 2,
          fill: 'white',
          r: 4
        }} activeDot={{
          stroke: 'red',
          strokeWidth: 2,
          fill: 'white',
          r: 6
        }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>;
  }
  return <Card title="Income Activity" moreOptions={true} className="h-full text-black">
      <div className="flex items-center mb-4">
        <div className="flex items-center mr-4">
          <div className={`w-3 h-0.5 bg-green-800 mr-1`}></div>
          <span className="text-xs text-gray-500">Actual Income</span>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{
          top: 5,
          right: 20,
          left: 0,
          bottom: 5,
        }}>
            <CartesianGrid vertical={false} stroke="#f5f5f5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
            fontSize: 10
          }} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={value => `${value / 1000}k`} tick={{
            fontSize: 10
          }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="green" strokeWidth={2} dot={{
            stroke: 'green',
            strokeWidth: 2,
            fill: 'white',
            r: 4
          }} activeDot={{
            stroke: 'green',
            strokeWidth: 2,
            fill: 'white',
            r: 6
          }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>;
};
export default ExpenseActivityCard;