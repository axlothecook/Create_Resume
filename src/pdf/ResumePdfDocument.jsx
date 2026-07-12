import { Document, Page, View, Text, Link, StyleSheet, Svg, Path, Font } from '@react-pdf/renderer';
// Font sources must work in BOTH environments react-pdf runs in here:
//   • the browser  (the app's "Download PDF")     -> needs an http(s) URL
//   • Node         (scripts/render-samples.jsx)   -> needs an absolute filesystem path
// A plain Vite asset import gives a URL string, which Node then tries to open as a path
// ("C:\src\pdf\fonts\…" -> ENOENT). Resolve against import.meta.url and convert a file://
// URL to a real path, without importing node:url (that would break the browser bundle).
const fontSrc = (file) => {
    const url = new URL(`./fonts/${file}`, import.meta.url);
    if (url.protocol !== 'file:') return url.href;                 // browser: fetchable URL
    const p = decodeURIComponent(url.pathname);                    // node: /C:/… -> C:\…
    return p.replace(/^\/([A-Za-z]:)/, '$1');
};

/*
 * Vector PDF rendering of the résumé. Mirrors the on-screen content + the `style`
 * object (accent color, font, section order, and the name/contact panel position:
 * top / left / right / grid). True selectable-text PDF, independent of screen size.
 */

// --- Font registration --------------------------------------------------------------
// We must NOT use react-pdf's built-in Helvetica/Times: those are the PDF standard-14
// fonts, which are limited to WinAnsi/Latin-1 — Latin-1 has NO č ć š ž đ, so Croatian
// text was silently DROPPED from the PDF ("Šegović" printed as "Šegovi", "tečno" as
// "te no"). Roboto (Apache-2.0, vendored in ./fonts) carries the full Latin-Extended-A
// range, so the diacritics render. Registered once at module load.
Font.register({
    family: 'Roboto',
    fonts: [
        { src: fontSrc('Roboto-Regular.ttf'), fontWeight: 'normal', fontStyle: 'normal' },
        { src: fontSrc('Roboto-Bold.ttf'), fontWeight: 'bold', fontStyle: 'normal' },
        { src: fontSrc('Roboto-Italic.ttf'), fontWeight: 'normal', fontStyle: 'italic' },
    ],
});
// Don't hyphenate: react-pdf's default hyphenation callback splits words oddly in the
// narrow entry columns.
Font.registerHyphenationCallback((word) => [word]);

// --- Font mapping -----------------------------------------------------------------
// Every app font choice maps onto the registered Unicode family. The style variants are
// selected via fontWeight/fontStyle rather than separate family names (which is how
// Font.register above is keyed).
const PDF_FAMILY = 'Roboto';
const pdfFontFor = () => PDF_FAMILY;

// --- Date + link helpers (SHARED with the on-screen demo via utils/resumeFormat, so
// the two render paths can't drift; also handles the ISO strings saved dates become
// after the JSON round-trip, which used to print raw here) --------------------------
import { formatResumeDate as formatDate, todayString, toHref } from '../utils/resumeFormat';

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
// Email is a filled FontAwesome glyph; phone + location are stroked outline icons
// (24x24 viewBox) supplied by the user.
const Icon = ({ kind, color, size = 8 }) => {
    const icons = {
        email: {
            vb: '0 0 512 512',
            fill: [{ d: 'M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z' }],
        },
        phone: {
            vb: '0 0 24 24',
            stroke: { width: 1.5 },
            paths: ['M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z'],
        },
        location: {
            vb: '0 0 24 24',
            stroke: { width: 2 },
            paths: [
                'M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z',
                'M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z',
            ],
        },
    };
    const ic = icons[kind];
    return (
        <Svg viewBox={ic.vb} width={size} height={size}>
            {ic.fill
                ? ic.fill.map((p, i) => <Path key={i} d={p.d} fill={color} />)
                : ic.paths.map((d, i) => (
                    <Path key={i} d={d} stroke={color} strokeWidth={ic.stroke.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ))}
        </Svg>
    );
};

export default function ResumePdfDocument({ personalDetails, skills, orderedSections, style }) {
    const accent = style.color || '#607480';
    // One registered Unicode family; weight/style are set per-style (fontWeight/fontStyle).
    const font = pdfFontFor(style.font);
    const today = todayString();

    // Where does the name/contact panel sit?
    const grid = !!style.gridView;
    const pos = style.personalInfoBox === 'personal-info-box-left' ? 'left'
        : style.personalInfoBox === 'personal-info-box-right' ? 'right'
        : 'top';
    const sidebar = grid || pos === 'left' || pos === 'right'; // panel rendered as a side column

    // "Underlined" style: no fills — transparent header, black name/contacts, black
    // section titles with a thin rule. "Filled" (default): accent header banner + section
    // titles on a filled background bar (a light tint vs the accent), accent text, NO rule.
    const underlined = !!style.underlined;
    const panelBg = underlined ? 'transparent' : accent;
    const headerTextColor = underlined ? '#1a1a1a' : onAccent(accent);
    const titleColor = underlined ? '#1a1a1a' : accent;
    // Title-bar background for the filled style (ported from checkBrightnessTab): a dark
    // accent gets a light bar, a light accent gets a black bar.
    const titleBarBg = onAccent(accent) === '#ffffff' ? '#eef1f3' : '#000000';

    const s = StyleSheet.create({
        page: { fontFamily: font, fontSize: 7.5, color: '#1a1a1a', lineHeight: 1.3, display: 'flex', flexDirection: 'column' },
        // "Made with Resume Creator" credit, centred near the bottom of the page.
        credit: { position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', fontSize: 7, color: '#9aa0a6' },
        creditLink: { color: '#9aa0a6', textDecoration: 'underline' },
        // Panel (name + contacts). Horizontal padding of 16 matches the body so the
        // underlined header rule lines up with the section-title rules below it.
        panel: {
            backgroundColor: panelBg,
            color: headerTextColor,
            display: 'flex',
            flexDirection: 'column',
            gap: sidebar ? 10 : 5, // roomier spacing between name + contacts in the side column
        },
        // Top banner: full width, centred. Underlined → top/bottom padding only + a
        // bottom rule that matches the section rules' width (via the 16 side padding).
        panelTop: {
            width: '100%',
            alignItems: 'center',
            textAlign: 'center',
            // Match the body's horizontal inset (16) so the underlined header rule lines
            // up exactly with the section rules below it. Longhand to avoid shorthand parsing.
            paddingTop: underlined ? 6 : 14,
            paddingBottom: underlined ? 8 : 14,
            paddingLeft: 16,
            paddingRight: 16,
            ...(underlined ? { borderBottomWidth: 1, borderBottomColor: '#1a1a1a' } : {}),
        },
        // Side column: narrower, with extra left padding so text sits in from the edge.
        // Underlined divider sits on the edge facing the content column: right edge when
        // the sidebar is on the left, left edge when the sidebar is on the right.
        panelSide: {
            width: '30%',
            alignItems: 'flex-start',
            paddingTop: 18,
            paddingBottom: 18,
            paddingLeft: 18,
            paddingRight: 14,
            ...(underlined
                ? (pos === 'right'
                    ? { borderLeftWidth: 1, borderLeftColor: '#cccccc' }
                    : { borderRightWidth: 1, borderRightColor: '#cccccc' })
                : {}),
        },
        name: { fontFamily: font, fontWeight: 'bold',fontSize: sidebar ? 17 : 14, color: headerTextColor, marginBottom: 4 },
        // section title colour switches with the style; underline rule kept in both.
        contactRow: { flexDirection: sidebar ? 'column' : 'row', flexWrap: 'wrap', gap: sidebar ? 8 : 9, alignItems: sidebar ? 'flex-start' : 'center' },
        contactItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
        // lineHeight:1 strips the text box's extra vertical padding so the glyphs sit at
        // the box centre, matching the icon (otherwise the icon looks lower than the text).
        contactText: { color: headerTextColor, fontSize: sidebar ? 9 : 7, lineHeight: 1 },
        contactSep: { color: headerTextColor, fontSize: sidebar ? 9 : 7, lineHeight: 1, opacity: 0.6 },
        // Body
        body: { padding: 16, display: 'flex', flexDirection: 'column', gap: 8 },
        // Underlined-top header rendered inside the body: centred, bottom rule identical
        // in width to the section-title rules (same body inset), so all 5 lines match.
        topHeaderInBody: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 6, // space between the name and the email/phone/location row
            paddingBottom: 2, // tight gap between the contacts and the separator line
            // NO extra marginBottom: the body's 8pt flex gap alone separates the header
            // rule from the first section title — exactly like every other separator ->
            // title gap. (It used to add 8 on top, so the FIRST title sat twice as far
            // from its rule as all the others.)
            borderBottomWidth: 1,
            borderBottomColor: '#1a1a1a',
        },
        section: { display: 'flex', flexDirection: 'column', gap: 3 },
        // Filled → title sits on a filled background bar (no rule). Underlined → black
        // title with a bottom rule (the underline), no bar.
        sectionTitle: underlined
            // Underlined: NO rule on the title itself. The rules are SEPARATORS between
            // blocks (header | section | section …), which is what the on-screen demo does
            // — so the line reads as sitting ABOVE each section title, and the header's rule
            // doubles as the line above the first one. The PDF used to hang a borderBottom
            // off the title, which drew the line BETWEEN the title and its own content.
            ? { fontFamily: font, fontWeight: 'bold', fontSize: 9, color: titleColor, textAlign: 'center', marginBottom: 1.5 }
            : { fontFamily: font, fontWeight: 'bold',fontSize: 9, color: titleColor, textAlign: 'center', backgroundColor: titleBarBg, paddingTop: 2.5, paddingBottom: 2.5, marginBottom: 1.5 },
        // The separator rule drawn BETWEEN sections in the underlined style (mirrors the
        // demo's <hr>); same colour/width as the header's bottom rule so all lines match.
        sectionSeparator: { borderBottomWidth: 1, borderBottomColor: '#1a1a1a', width: '100%' },
        // Narrow date/location column: it only needs room for a date range or a link
        // label, so the entry text sits next to it instead of far right. Mirrors the
        // demo's .resume-details-box grid (20% / 3% gap / 77%).
        entry: { flexDirection: 'row', gap: '3%', marginBottom: 3 },
        entryLeft: { width: '20%' },
        entryRight: { width: '77%' },
        dateText: { fontFamily: font, fontWeight: 'bold',fontSize: 7 },
        locationText: { fontSize: 7, color: '#444' },
        link: { fontSize: 7, color: accent, textDecoration: 'underline' },
        entryTitle: { fontFamily: font, fontWeight: 'bold',fontSize: 8 },
        entrySubtitle: { fontFamily: font, fontStyle: 'italic',fontSize: 7.5, color: '#333' },
        bulletRow: { flexDirection: 'row', gap: 3, marginTop: 0.5 },
        bulletDot: { fontSize: 7.5 },
        bulletText: { fontSize: 7.5, flex: 1 },
        skillGroupTitle: { fontFamily: font, fontWeight: 'bold',fontSize: 8, marginBottom: 1 },
        skillText: { fontSize: 7.5 },
        // Layout containers. flexGrow makes the row fill the page height so the side
        // panel (accent column) stretches all the way down, not just to its content.
        rowLayout: { flexDirection: 'row', flexGrow: 1, alignItems: 'stretch' },
    });

    // The contact row, with " | " separators between items in the horizontal (top)
    // layout — matching the on-screen demo. The sidebar stacks them vertically (no sep).
    const ContactRow = () => {
        const items = [
            { kind: 'email', value: personalDetails.email },
            { kind: 'phone', value: personalDetails.phoneNumber },
            { kind: 'location', value: personalDetails.address },
        ].filter(it => it.value);
        return (
            <View style={s.contactRow}>
                {items.map((it, i) => (
                    <View key={it.kind} style={s.contactItem}>
                        <Icon kind={it.kind} color={headerTextColor} size={sidebar ? 10 : 8} />
                        <Text style={s.contactText}>{it.kind === 'phone' ? `+${it.value}` : it.value}</Text>
                        {!sidebar && i < items.length - 1 && <Text style={s.contactSep}>  |  </Text>}
                    </View>
                ))}
            </View>
        );
    };

    const Panel = (
        <View style={[s.panel, sidebar ? s.panelSide : s.panelTop]}>
            <Text style={s.name}>{personalDetails.fullname || ''}</Text>
            <ContactRow />
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
                    {/* links?.length (not just `links`): an empty links array must not
                        suppress the location line. Links are real clickable <Link>
                        annotations (they were plain <Text> before — looked like links
                        in the PDF but did nothing), with the href normalized so
                        protocol-less URLs don't resolve as relative paths. */}
                    {!item.links?.length && !!item.subtext && <Text style={s.locationText}>{item.subtext}</Text>}
                    {!!item.links?.length && item.links.map((l, li) => (
                        // Show the label; fall back to the raw URL only when no label was set.
                        <Link key={l.id ?? li} style={s.link} src={toHref(l.text)}>{l.name?.trim() ? l.name : l.text}</Link>
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

    const skillGroups = (
        <>
            {(skills.skillList?.length > 0) && (
                <View style={{ marginBottom: 4 }}>
                    {/* Title row: "Technical Skills" + the optional CLICKABLE portfolio
                        link beside it (mirrors the on-screen demo's title row). */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={s.skillGroupTitle}>Technical Skills</Text>
                        {!!skills.portfolioLink && (
                            <Text style={{ ...s.skillText, marginLeft: 6 }}>Full skill list at</Text>
                        )}
                        {!!skills.portfolioLink && (
                            <Link style={{ ...s.link, fontSize: s.skillText.fontSize, marginLeft: 4 }} src={toHref(skills.portfolioLink)}>
                                {skills.portfolioLinkName?.trim() ? skills.portfolioLinkName : skills.portfolioLink}
                            </Link>
                        )}
                    </View>
                    <Text style={s.skillText}>{skills.skillList.map(x => x.text).join(', ')}</Text>
                </View>
            )}
            {(skills.languageList?.length > 0) && (
                <View>
                    <Text style={s.skillGroupTitle}>Languages</Text>
                    <Text style={s.skillText}>{skills.languageList.map(x => x.text).join(', ')}</Text>
                </View>
            )}
        </>
    );

    const SkillsBlock = (
        <View style={s.section}>
            <Text style={s.sectionTitle}>SKILLS & LANGUAGES</Text>
            {/* Skills content is flush-left in the content column in EVERY layout — aligned
                with where the other sections' content (and titles) start, not indented. */}
            {skillGroups}
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

    // In the underlined TOP layout the header lives INSIDE the body, so its bottom rule
    // shares the exact same horizontal inset as the section-title rules (all equal width).
    const topUnderlinedInBody = underlined && !sidebar;
    // Build the visible sections first, then (in the underlined style) interleave a
    // separator rule BETWEEN them — the same model the demo uses, so the rule reads as
    // the line above each section title.
    const visibleSections = orderedSections.map(renderSection).filter(Boolean);
    const sectionsWithRules = underlined
        ? visibleSections.flatMap((node, i) => (
            i < visibleSections.length - 1
                ? [node, <View key={`sep-${i}`} style={s.sectionSeparator} />]
                : [node]
        ))
        : visibleSections;

    const bodyContent = (
        <View style={s.body}>
            {topUnderlinedInBody && (
                <View style={s.topHeaderInBody}>
                    <Text style={s.name}>{personalDetails.fullname || ''}</Text>
                    <ContactRow />
                </View>
            )}
            {sectionsWithRules}
        </View>
    );

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {sidebar ? (
                    <View style={s.rowLayout}>
                        {pos === 'right' ? (
                            <>
                                <View style={{ width: '70%' }}>{bodyContent}</View>
                                {Panel}
                            </>
                        ) : (
                            <>
                                {Panel}
                                <View style={{ width: '70%' }}>{bodyContent}</View>
                            </>
                        )}
                    </View>
                ) : (
                    <>
                        {/* Filled top → accent banner above the body. Underlined top → the header
                            is rendered inside the body (so its rule matches the section rules). */}
                        {!topUnderlinedInBody && Panel}
                        {bodyContent}
                    </>
                )}

                {/* Optional "Made with Resume Creator" credit, centred at the page bottom. */}
                {style.showCredit && (
                    <Text style={s.credit} fixed>
                        Made with <Link style={s.creditLink} src="https://github.com/axlothecook/Create_Resume">Resume Creator</Link>
                    </Text>
                )}
            </Page>
        </Document>
    );
}
