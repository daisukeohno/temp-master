import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MeterCard } from './MeterCard';
import { makeHistory, makeMeter } from '../test/fixtures';

describe('MeterCard', () => {
  it('renders the mapped display name and current readings', () => {
    render(<MeterCard meter={makeMeter()} history={makeHistory()} timeScale="day" />);

    expect(screen.getByText('第1蒸留塔 (T-101)')).toBeInTheDocument();
    expect(screen.getByText('24.5°C')).toBeInTheDocument();
    expect(screen.getByText('48%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('marks stale meters and hides the chart', () => {
    render(
      <MeterCard
        meter={makeMeter({ device_name: 'Unknown Device', last_updated: null })}
        history={[]}
        timeScale="day"
        stale
      />,
    );

    expect(screen.getByText('Unknown Device')).toBeInTheDocument();
    expect(screen.getByText('7日以上未更新')).toBeInTheDocument();
    expect(screen.getByText('履歴データの取得対象外')).toBeInTheDocument();
  });
});
