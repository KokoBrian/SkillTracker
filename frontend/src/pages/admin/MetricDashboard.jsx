import React, { useState } from 'react';
import { Users, Award, CheckCircle, UserCheck, Briefcase, TrendingUp, TrendingDown, BarChart3, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricDashboardCard = ({
  metrics = {},
  timeRange = 'week', // 'week', 'month', 'year'
  onTimeRangeChange
}) => {
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Metric configurations
  const metricConfigs = [
    {
      id: 'learners',
      title: 'Total Learners',
      value: metrics.total_learners || 0,
      change: metrics.learner_growth || 0,
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Active learners in the system'
    },
    {
      id: 'spus',
      title: 'Total SPUs',
      value: metrics.total_spus || 0,
      change: metrics.spu_growth || 0,
      icon: Award,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      description: 'Skill Progress Units submitted'
    },
    {
      id: 'verified',
      title: 'Verified SPUs',
      value: metrics.verified_spus || 0,
      change: metrics.verified_growth || 0,
      icon: CheckCircle,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      description: 'Successfully verified SPUs'
    },
    {
      id: 'teachers',
      title: 'Active Teachers',
      value: metrics.active_teachers || 0,
      change: metrics.teacher_growth || 0,
      icon: UserCheck,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      description: 'Teachers actively verifying'
    },
    {
      id: 'partners',
      title: 'Juakali Partners',
      value: metrics.active_partners || 0,
      change: metrics.partner_growth || 0,
      icon: Briefcase,
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-600',
      description: 'Active verification partners'
    }
  ];

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Get trend indicator
  const getTrendIndicator = (change) => {
    if (change > 0) {
      return {
        icon: TrendingUp,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'up'
      };
    } else if (change < 0) {
      return {
        icon: TrendingDown,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'down'
      };
    }
    return {
      icon: TrendingUp,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      label: 'stable'
    };
  };

  // Calculate verification rate
  const verificationRate = metrics.total_spus > 0 
    ? ((metrics.verified_spus / metrics.total_spus) * 100).toFixed(1)
    : 0;

  // Time range options
  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              Platform Metrics
            </h2>
            <p className="text-gray-600">
              Overview of key performance indicators
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg p-1">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange && onTimeRangeChange(range.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Verification Rate */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Verification Rate</p>
            <p className="text-4xl font-bold">{verificationRate}%</p>
            <p className="text-xs opacity-75 mt-1">
              {metrics.verified_spus || 0} of {metrics.total_spus || 0} SPUs
            </p>
          </div>

          {/* Pending Verifications */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Pending Verification</p>
            <p className="text-4xl font-bold">
              {(metrics.total_spus || 0) - (metrics.verified_spus || 0)}
            </p>
            <p className="text-xs opacity-75 mt-1">Awaiting review</p>
          </div>

          {/* Average per Learner */}
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Avg SPUs per Learner</p>
            <p className="text-4xl font-bold">
              {metrics.total_learners > 0 
                ? (metrics.total_spus / metrics.total_learners).toFixed(1)
                : '0.0'
              }
            </p>
            <p className="text-xs opacity-75 mt-1">Skills per student</p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {metricConfigs.map((metric) => {
          const Icon = metric.icon;
          const trend = getTrendIndicator(metric.change);
          const TrendIcon = trend.icon;
          const isSelected = selectedMetric === metric.id;

          return (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(isSelected ? null : metric.id)}
              className={`group relative overflow-hidden bg-white rounded-xl shadow-md border-2 transition-all duration-300 text-left ${
                isSelected 
                  ? 'border-indigo-500 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg'
              }`}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

              <div className="relative p-5">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Value */}
                <div className="mb-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(metric.value)}
                  </p>
                </div>

                {/* Title */}
                <p className="text-sm font-medium text-gray-600 mb-3">
                  {metric.title}
                </p>

                {/* Trend */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${trend.bg}`}>
                    <TrendIcon className={`w-3.5 h-3.5 ${trend.color}`} />
                    <span className={`text-xs font-bold ${trend.color}`}>
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                  {isSelected && (
                    <div className="text-xs text-indigo-600 font-medium">
                      Selected
                    </div>
                  )}
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Metric Details */}
      {selectedMetric && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-200 p-6 mb-6">
          {(() => {
            const metric = metricConfigs.find(m => m.id === selectedMetric);
            const Icon = metric.icon;
            const trend = getTrendIndicator(metric.change);
            const TrendIcon = trend.icon;

            return (
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {metric.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {metric.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-bold text-gray-900">
                        {metric.value.toLocaleString()}
                      </span>
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${trend.bg}`}>
                        <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                        <span className={`text-sm font-bold ${trend.color}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Growth this {timeRange}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {metric.change > 0 ? '+' : ''}{Math.abs(Math.round(metric.value * metric.change / 100))}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Previous {timeRange}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {Math.round(metric.value - (metric.value * metric.change / 100))}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Growth rate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-green-600" />
            Growth Highlights
          </h3>
          <div className="space-y-3">
            {metricConfigs
              .filter(m => m.change > 0)
              .sort((a, b) => b.change - a.change)
              .slice(0, 3)
              .map(metric => {
                const Icon = metric.icon;
                return (
                  <div key={metric.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${metric.gradient} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{metric.title}</p>
                        <p className="text-xs text-gray-600">{formatNumber(metric.value)} total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">+{metric.change}%</p>
                      <p className="text-xs text-gray-500">growth</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Areas for Attention */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-amber-600" />
            Needs Attention
          </h3>
          <div className="space-y-3">
            {metricConfigs
              .filter(m => m.change <= 0)
              .map(metric => {
                const Icon = metric.icon;
                return (
                  <div key={metric.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${metric.gradient} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{metric.title}</p>
                        <p className="text-xs text-gray-600">{formatNumber(metric.value)} total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-600">
                        {metric.change === 0 ? '0' : metric.change}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {metric.change === 0 ? 'stable' : 'decline'}
                      </p>
                    </div>
                  </div>
                );
              })}
            {metricConfigs.filter(m => m.change <= 0).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="font-medium">All metrics growing!</p>
                <p className="text-sm">Keep up the great work</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component
const Demo = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Sample metrics with different growth trends
  const sampleMetrics = {
    total_learners: 1247,
    learner_growth: 12.5,
    total_spus: 3456,
    spu_growth: 18.3,
    verified_spus: 2891,
    verified_growth: 15.7,
    active_teachers: 89,
    teacher_growth: -2.1,
    active_partners: 34,
    partner_growth: 8.9
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    console.log('Time range changed to:', newRange);
    // In real app: fetch new data for the selected time range
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <MetricDashboardCard
        metrics={sampleMetrics}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />
    </div>
  );
};

export default Demo;