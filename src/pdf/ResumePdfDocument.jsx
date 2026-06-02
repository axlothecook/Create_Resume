import { Document, Page, View, Text, StyleSheet, Svg, Path } from '@react-pdf/renderer';

/*
 * Vector PDF rendering of the résumé. Mirrors the on-screen content + the `style`
 * object (accent color, font, section order, and the name/contact panel position:
 * top / left / right / grid). True selectable-text PDF, independent of screen size.
 */

// --- Font mapping -----------------------------------------------------------------
// react-pdf ships Helvetica & Times-Roman. Map the app's font choices onto a usable
// PDF family (Roboto/Calibri/Arial -> Helvetica; Times New Roman -> Times-Roman).
const pdfFontFor = (font) => {
    if (font && font.toLowerCase().includes('times')) return 'Times-Roman';
    return 'Helvetica';
};
const pdfBoldFor = (font) => {
    if (font && font.toLowerCase().includes('times')) return 'Times-Bold';
    return 'Helvetica-Bold';
};
const pdfItalicFor = (font) => {
    if (font && font.toLowerCase().includes('times')) return 'Times-Italic';
    return 'Helvetica-Oblique';
};

// --- Date helper (ported from General-Info-Block.jsx ongoingChecker) ---------------
const pad = (n) => String(n).padStart(2, '0');
const formatDate = (e, today) => {
    if (!e) return '';
    if (typeof e === 'string' && /^\d\d\/\d\d\d\d$/.test(e)) return e;
    // dayjs-like object from the picker
    if (typeof e === 'object' && e.$y !== undefined) {
        const entered = `${pad(e.$D)}/${pad(e.$M + 1)}/${e.$y}`;
        if (entered === today) return 'present';
        return `${pad(e.$M + 1)}/${e.$y}`;
    }
    return typeof e === 'string' ? e : '';
};

// Pick white or black text for legibility on the accent color (ported checkBrightness).
const onAccent = (hex) => {
    if (!hex || hex[0] !== '#') return '#ffffff';
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return brightness < 140 ? '#ffffff' : '#000000';
};

// --- Contact icons (vector, recoloured to the panel text colour) -------------------
const Icon = ({ kind, color, size = 8 }) => {
    const paths = {
        email: { vb: '0 0 512 512', d: 'M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z' },
        phone: { vb: '0 0 512 512', d: 'M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z' },
        location: { vb: '0 0 384 512', d: 'M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z' },
    };
    const p = paths[kind];
    return (
        <Svg viewBox={p.vb} width={size} height={size}>
            <Path d={p.d} fill={color} />
        </Svg>
    );
};

export default function ResumePdfDocument({ personalDetails, skills, orderedSections, style }) {
    const accent = style.color || '#607480';
    const font = pdfFontFor(style.font);
    const bold = pdfBoldFor(style.font);
    const italic = pdfItalicFor(style.font);
    const today = (() => { const d = new Date(); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; })();

    // Where does the name/contact panel sit?
    const grid = !!style.gridView;
    const pos = style.personalInfoBox === 'personal-info-box-left' ? 'left'
        : style.personalInfoBox === 'personal-info-box-right' ? 'right'
        : 'top';
    const sidebar = grid || pos === 'left' || pos === 'right'; // panel rendered as a side column

    const headerTextColor = onAccent(accent);

    const s = StyleSheet.create({
        page: { fontFamily: font, fontSize: 7.5, color: '#1a1a1a', lineHeight: 1.3 },
        // Panel (name + contacts)
        panel: { backgroundColor: accent, color: headerTextColor, padding: 14, display: 'flex', flexDirection: 'column', gap: 5 },
        panelTop: { width: '100%', alignItems: 'center', textAlign: 'center' },
        panelSide: { width: '32%', alignItems: 'flex-start' },
        name: { fontFamily: bold, fontSize: 14, color: headerTextColor, marginBottom: 3 },
        contactRow: { flexDirection: sidebar ? 'column' : 'row', flexWrap: 'wrap', gap: sidebar ? 3 : 9, alignItems: sidebar ? 'flex-start' : 'center' },
        contactItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
        contactText: { color: headerTextColor, fontSize: 7 },
        // Body
        body: { padding: 16, display: 'flex', flexDirection: 'column', gap: 8 },
        section: { display: 'flex', flexDirection: 'column', gap: 3 },
        sectionTitle: { fontFamily: bold, fontSize: 9, color: accent, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: accent, paddingBottom: 1.5, marginBottom: 1.5 },
        entry: { flexDirection: 'row', gap: '4%', marginBottom: 3 },
        entryLeft: { width: '30%' },
        entryRight: { width: '66%' },
        dateText: { fontFamily: bold, fontSize: 7 },
        locationText: { fontSize: 7, color: '#444' },
        link: { fontSize: 7, color: accent, textDecoration: 'underline' },
        entryTitle: { fontFamily: bold, fontSize: 8 },
        entrySubtitle: { fontFamily: italic, fontSize: 7.5, color: '#333' },
        bulletRow: { flexDirection: 'row', gap: 3, marginTop: 0.5 },
        bulletDot: { fontSize: 7.5 },
        bulletText: { fontSize: 7.5, flex: 1 },
        skillGroupTitle: { fontFamily: bold, fontSize: 8, marginBottom: 1 },
        skillText: { fontSize: 7.5 },
        // Layout containers
        rowLayout: { flexDirection: 'row' },
    });

    const ContactItem = ({ kind, value }) => value ? (
        <View style={s.contactItem}>
            <Icon kind={kind} color={headerTextColor} />
            <Text style={s.contactText}>{kind === 'phone' ? `+${value}` : value}</Text>
        </View>
    ) : null;

    const Panel = (
        <View style={[s.panel, sidebar ? s.panelSide : s.panelTop]}>
            <Text style={s.name}>{personalDetails.fullname || ''}</Text>
            <View style={s.contactRow}>
                <ContactItem kind="email" value={personalDetails.email} />
                <ContactItem kind="phone" value={personalDetails.phoneNumber} />
                <ContactItem kind="location" value={personalDetails.address} />
            </View>
        </View>
    );

    const renderEntry = (item, i) => {
        const start = formatDate(item.startDate, today);
        const end = formatDate(item.endDate, today);
        const dateRange = (start || end) ? `${start}${start && end ? ' - ' : ''}${end}` : '';
        return (
            <View style={s.entry} key={item.id ?? i} wrap={false}>
                <View style={s.entryLeft}>
                    {!!dateRange && <Text style={s.dateText}>{dateRange}</Text>}
                    {!item.links && !!item.subtext && <Text style={s.locationText}>{item.subtext}</Text>}
                    {item.links && item.links.map((l, li) => (
                        <Text key={l.id ?? li} style={s.link}>{l.text}</Text>
                    ))}
                </View>
                <View style={s.entryRight}>
                    {!!item.title && <Text style={s.entryTitle}>{item.title}</Text>}
                    {!!item.subtitle && <Text style={s.entrySubtitle}>{item.subtitle}</Text>}
                    {(item.description || []).map((b, bi) => (
                        <View style={s.bulletRow} key={b.id ?? bi}>
                            <Text style={s.bulletDot}>•</Text>
                            <Text style={s.bulletText}>{b.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const SkillsBlock = (
        <View style={s.section}>
            <Text style={s.sectionTitle}>SKILLS & LANGUAGES</Text>
            {(skills.skillList?.length > 0) && (
                <View style={{ marginBottom: 3 }}>
                    <Text style={s.skillGroupTitle}>Technical Skills</Text>
                    <Text style={s.skillText}>{skills.skillList.map(x => x.text).join(', ')}</Text>
                </View>
            )}
            {(skills.languageList?.length > 0) && (
                <View>
                    <Text style={s.skillGroupTitle}>Languages</Text>
                    <Text style={s.skillText}>{skills.languageList.map(x => x.text).join(', ')}</Text>
                </View>
            )}
        </View>
    );

    const renderSection = (sec) => {
        if (sec.key === 'skill') {
            const has = (skills.skillList?.length > 0) || (skills.languageList?.length > 0);
            return has ? <View key="skill">{SkillsBlock}</View> : null;
        }
        if (!sec.items || sec.items.length === 0) return null;
        return (
            <View style={s.section} key={sec.key}>
                <Text style={s.sectionTitle}>{sec.label}</Text>
                {sec.items.filter(it => !it.hidden).map(renderEntry)}
            </View>
        );
    };

    const bodyContent = <View style={s.body}>{orderedSections.map(renderSection)}</View>;

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {sidebar ? (
                    <View style={s.rowLayout}>
                        {pos === 'right' ? (
                            <>
                                <View style={{ width: '68%' }}>{bodyContent}</View>
                                {Panel}
                            </>
                        ) : (
                            <>
                                {Panel}
                                <View style={{ width: '68%' }}>{bodyContent}</View>
                            </>
                        )}
                    </View>
                ) : (
                    <>
                        {Panel}
                        {bodyContent}
                    </>
                )}
            </Page>
        </Document>
    );
}
