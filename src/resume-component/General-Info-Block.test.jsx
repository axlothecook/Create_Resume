import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GeneralInfoBox from './General-Info-Block';

// Minimal style + brightness helper the component expects.
const style = { font: 'Roboto', underlined: false, color: '#607480' };
const setTxtClr = () => '#eee';

const renderBox = (arr) =>
  render(<GeneralInfoBox assumeStyle={style} setTxtClr={setTxtClr} resumeTitle="PERSONAL PROJECTS" arr={arr} />);

describe('GeneralInfoBox date rendering', () => {
  it('does NOT render a lone "-" when an item has no dates', () => {
    renderBox([{ id: 1, title: 'Blank', subtitle: '', startDate: '', endDate: '', links: [], description: [] }]);
    // The old bug rendered a heading whose only text was "-".
    const loneDash = screen.queryAllByText((_, el) => el?.tagName === 'H4' && el.textContent.trim() === '-');
    expect(loneDash).toHaveLength(0);
  });

  it('renders a full "start - end" range when both dates exist', () => {
    renderBox([{ id: 1, title: 'Proj', subtitle: '', startDate: '08/2019', endDate: '02/2020', links: [], description: [] }]);
    expect(screen.getByText('08/2019 - 02/2020')).toBeInTheDocument();
  });

  it('renders a single date with no dash when only one end is set', () => {
    renderBox([{ id: 1, title: 'Proj', subtitle: '', startDate: '08/2019', endDate: '', links: [], description: [] }]);
    expect(screen.getByText('08/2019')).toBeInTheDocument();
    expect(screen.queryByText(/-/)).toBeNull();
  });
});

describe('GeneralInfoBox link rendering', () => {
  it('shows the link label (not the raw URL) and links to the URL', () => {
    renderBox([{
      id: 1, title: 'Proj', subtitle: '', startDate: '08/2019', endDate: '02/2020',
      links: [{ id: 1, text: 'www.archery.example', name: 'Archery website' }],
      description: [],
    }]);
    const link = screen.getByRole('link', { name: 'Archery website' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.archery.example');
    // The raw URL must not be the visible text.
    expect(screen.queryByText('www.archery.example')).toBeNull();
  });

  it('falls back to the raw URL when a link has no label', () => {
    renderBox([{
      id: 1, title: 'Proj', subtitle: '', startDate: '08/2019', endDate: '02/2020',
      links: [{ id: 1, text: 'www.nolabel.example', name: '' }],
      description: [],
    }]);
    expect(screen.getByRole('link', { name: 'www.nolabel.example' })).toBeInTheDocument();
  });
});
