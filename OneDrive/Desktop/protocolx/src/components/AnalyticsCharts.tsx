import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { CatchUpAnalysis } from '../types';

interface AnalyticsChartsProps {
  analysis: CatchUpAnalysis;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analysis }) => {
  const { priorities, actionItems, decisions, deadlines, mentions } = analysis;

  const highCount = priorities.filter(p => p.priority === 'High').length;
  const medCount = priorities.filter(p => p.priority === 'Medium').length;
  const lowCount = priorities.filter(p => p.priority === 'Low').length;

  const priorityData = [
    { name: 'HIGH', count: highCount, color: '#FF7F91' },
    { name: 'MEDIUM', count: medCount, color: '#FFC777' },
    { name: 'LOW', count: lowCount, color: '#45E0C1' },
  ];

  const categoryData = [
    { name: 'Actions', value: actionItems.length, color: '#45E0C1' },
    { name: 'Decisions', value: decisions.length, color: '#8AA8FF' },
    { name: 'Deadlines', value: deadlines.length, color: '#FFC777' },
    { name: 'Mentions', value: mentions.length, color: '#67E8CE' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Priority Breakdown */}
      <div className="p-4 rounded-2xl bg-aurora-surface border border-aurora-border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-aurora-text">
            Priority Breakdown
          </h4>
          <span className="text-[11px] font-semibold text-aurora-primary">Urgency Distribution</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" stroke="currentColor" className="text-aurora-muted" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="currentColor" className="text-aurora-text font-bold" fontSize={11} width={60} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--tooltip-bg, #FFFFFF)', borderColor: 'rgba(13, 148, 136, 0.2)', borderRadius: 12, fontSize: 12, color: 'var(--tooltip-text, #0F1C1E)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} 
                cursor={{ fill: 'rgba(13, 148, 136, 0.06)' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Intelligence Category Mix */}
      <div className="p-4 rounded-2xl bg-aurora-surface border border-aurora-border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-aurora-text">
            Extracted Intelligence Mix
          </h4>
          <span className="text-[11px] text-aurora-muted">Total Insights</span>
        </div>
        <div className="h-44 w-full flex items-center justify-center">
          {categoryData.length === 0 ? (
            <div className="text-xs text-aurora-muted">No categories recorded</div>
          ) : (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #FFFFFF)', borderColor: 'rgba(13, 148, 136, 0.2)', borderRadius: 12, fontSize: 12, color: 'var(--tooltip-text, #0F1C1E)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-1 text-[11px] text-aurora-muted">
          {categoryData.map((d, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span>{d.name}: <strong className="text-aurora-text">{d.value}</strong></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
