import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillResumeDiv from './SkillsLangResumeDiv';

const style = { font: 'Roboto', underlined: false, color: '#607480' };
const setTxtClr = () => '#eee';

const renderSkills = (props) =>
  render(
    <SkillResumeDiv
      assumeStyle={style}
      setTxtClr={setTxtClr}
      skillArr={[{ id: 1, text: 'painting' }]}
      langArr={[{ id: 1, text: 'English' }]}
      {...props}
    />,
  );

describe('SkillResumeDiv portfolio link', () => {
  it('renders no portfolio link or lead-in when portfolioLink is empty', () => {
    renderSkills({ portfolioLink: '', portfolioLinkName: '' });
    expect(screen.queryByText(/Full skill list at/i)).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('shows the "Full skill list at" lead-in and the label (not the URL) when set', () => {
    renderSkills({ portfolioLink: 'portfolio.axlothecook.com', portfolioLinkName: 'portfolio website' });
    expect(screen.getByText(/Full skill list at/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'portfolio website' });
    expect(link).toHaveAttribute('href', 'https://portfolio.axlothecook.com');
    expect(screen.queryByText('portfolio.axlothecook.com')).toBeNull();
  });

  it('falls back to the raw URL as link text when no label is set', () => {
    renderSkills({ portfolioLink: 'portfolio.axlothecook.com', portfolioLinkName: '' });
    expect(screen.getByRole('link', { name: 'portfolio.axlothecook.com' })).toBeInTheDocument();
  });
});

describe('SkillResumeDiv headings', () => {
  it('uses the plural "Languages" heading', () => {
    renderSkills({ portfolioLink: '', portfolioLinkName: '' });
    expect(screen.getByText('Languages')).toBeInTheDocument();
    // The old singular label must be gone.
    expect(screen.queryByText('Language')).toBeNull();
  });
});
