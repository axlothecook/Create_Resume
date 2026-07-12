// Headless sample-PDF renderer for reviewing the react-pdf layouts.
// Run with: npx vite-node scripts/render-samples.jsx
import { renderToFile } from '@react-pdf/renderer';
import React from 'react';
import ResumePdfDocument from '../src/pdf/ResumePdfDocument.jsx';

const personalDetails = {
    fullname: 'Maja Šegović',
    email: 'clea.desandre@gmail.co.fr',
    phoneNumber: '33 7807 63 733',
    address: 'Varaždin, Hrvatska',
};
const skills = {
    portfolioLink: 'www.cleadesandre-portfolio.fr',
    portfolioLinkName: 'portfolio website',
    skillList: [{ id: 1, text: 'painting' }, { id: 2, text: 'art guide' }, { id: 3, text: 'color mixing' }],
    languageList: [{ id: 1, text: 'Hrvatski (materinji)' }, { id: 2, text: 'Engleski (tečno)' }],
    toolList: [{ id: 1, text: 'Photoshop' }, { id: 2, text: 'Procreate' }],
};
const education = [{
    id: 1, title: 'University of Painters', subtitle: 'Bachelor in Arts', subtext: 'Paris, France',
    startDate: '09/2017', endDate: '06/2021',
    description: [{ id: 1, text: "painted and showcased 'El la vouivre'" }],
}];
const experience = [
    { id: 1, title: 'Musée Bourdelle', subtitle: 'painter assistent', subtext: 'Paris, France', startDate: '04/2021', endDate: '05/2022', description: [{ id: 1, text: 'suggested application techniques and gave inspiration based on historic examples' }] },
    { id: 2, title: 'Perrotin', subtitle: 'guide', subtext: 'Paris, France', startDate: '07/2021', endDate: '11/2021', description: [{ id: 1, text: 'expressed delicate summaries of each art piece to visitors' }] },
];
const project = [{
    id: 1, title: 'El la vouivre', subtitle: 'Creator', startDate: '08/2019', endDate: '02/2020',
    links: [{ id: 1, text: 'www.youngArtistsPaintings.fr', name: 'Young Artists Paintings' }],
    description: [{ id: 1, text: 'practiced the acrylic technique mixed with oil on canvas' }],
}];

const orderedSections = [
    { key: 'project', label: 'PERSONAL PROJECTS', items: project },
    { key: 'experience', label: 'EXPERIENCE', items: experience },
    { key: 'skill', label: 'SKILLS & LANGUAGES' },
    { key: 'education', label: 'EDUCATION', items: education },
];

const baseStyle = { color: '#607480', font: 'Roboto', underlined: false, gridView: false };
const layouts = [
    { name: 'top', style: { ...baseStyle, personalInfoBox: 'personal-info-box-no-side-padding' } },
    { name: 'credit', style: { ...baseStyle, personalInfoBox: 'personal-info-box-no-side-padding', showCredit: true } },
    { name: 'left', style: { ...baseStyle, personalInfoBox: 'personal-info-box-left' } },
    { name: 'right', style: { ...baseStyle, personalInfoBox: 'personal-info-box-right' } },
    { name: 'grid', style: { ...baseStyle, personalInfoBox: 'personal-info-box-no-side-padding', gridView: true } },
    { name: 'underlined', style: { ...baseStyle, personalInfoBox: 'personal-info-box-no-side-padding', underlined: true } },
    { name: 'left-underlined', style: { ...baseStyle, personalInfoBox: 'personal-info-box-left', gridView: true, underlined: true } },
    { name: 'right-underlined', style: { ...baseStyle, personalInfoBox: 'personal-info-box-right', gridView: true, underlined: true } },
];

for (const l of layouts) {
    await renderToFile(
        React.createElement(ResumePdfDocument, { personalDetails, skills, orderedSections, style: l.style }),
        `scripts/sample-${l.name}.pdf`
    );
    console.log(`rendered scripts/sample-${l.name}.pdf`);
}
