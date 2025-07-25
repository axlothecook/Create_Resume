import { useState } from 'react';
import './resumeEditor.css';

const CutomizeComponentDiv = (props) => {
    const [selected, setSelected] = useState({
        topLayout: (props.styleItself.personalInfoBox === 'personal-info-box-no-side-padding') ? '#bec2d0' : 'transparent',
        leftLayout: (props.styleItself.personalInfoBox === 'personal-info-box-left') ? '#bec2d0' : 'transparent',
        rigthLayout: (props.styleItself.personalInfoBox === 'personal-info-box-right') ? '#bec2d0' : 'transparent',
        calibriFont: (props.styleItself.font === `Calibri`) ? '#bec2d0' : 'transparent',
        tnr: (props.styleItself.font === `Times New Roman`) ? '#bec2d0' : 'transparent',
        arial: (props.styleItself.font === `Arial`) ? '#bec2d0' : 'transparent',
        sans: (props.styleItself.font === `Roboto`) ? '#bec2d0' : 'transparent',
        filledOut: props.styleItself.filledOut ? '#bec2d0' : 'transparent',
        underlined: props.styleItself.underlined ? '#bec2d0' : 'transparent'
    });

    return (
        <>
            <div style={{backgroundColor: !props.themeProp ? '#fff' : '#504d75ff'}} className="customize-segment">
                <h2>Layout</h2>
                <div className="sub-layout-segments">
                    <div className="layout-segment" onClick={() => {
                        props.changeStyle({
                            ...props.styleItself,
                            gridView: false,
                            resumeView: 'resume-view-top',
                            personalInfoBox: 'personal-info-box-no-side-padding',
                            personalInfoDetail: 'personal-info-details-row',
                            resumeInfoParentBoxLeft: 'resume-info-parent-box-left'
                        });
                        setSelected({
                            ...selected,
                            topLayout: '#bec2d0',
                            leftLayout: 'transparent',
                            rigthLayout: 'transparent',
                        });
                    }}>
                        <div className="layout-box-example top-example">
                            <div style={{backgroundColor: props.styleItself.color}}></div>
                            <div></div>
                        </div>
                        <h3>Top</h3>
                        <div className="select-bar" style={{backgroundColor: selected.topLayout}}></div>
                    </div>
                    <div className="layout-segment" onClick={() => {
                        props.changeStyle({
                            ...props.styleItself,
                            gridView: true,
                            resumeView: 'resume-view-right',
                            personalInfoBox: 'personal-info-box-left',
                            personalInfoDetail: 'personal-info-details-column',
                            resumeInfoParentBoxLeft: 'resume-info-parent-box-left'
                        });
                        setSelected({
                            ...selected,
                            topLayout: 'transparent',
                            leftLayout: '#bec2d0',
                            rigthLayout: 'transparent',
                        });
                    }}>
                        <div className="layout-box-example left-example">
                            <div style={{backgroundColor: props.styleItself.color}}></div>
                            <div></div>
                        </div>
                        <h3>Left</h3>
                        <div className="select-bar" style={{backgroundColor: selected.leftLayout}}></div>
                    </div>
                    <div className="layout-segment" onClick={() => {
                        props.changeStyle({
                            ...props.styleItself,
                            gridView: true,
                            resumeView: 'resume-view-right',
                            personalInfoBox: 'personal-info-box-right',
                            personalInfoDetail: 'personal-info-details-column',
                            resumeInfoParentBoxLeft: 'resume-info-parent-box-right'
                        });
                        setSelected({
                            ...selected,
                            topLayout: 'transparent',
                            leftLayout: 'transparent',
                            rigthLayout: '#bec2d0',
                        });
                    }}>
                        <div className="layout-box-example right-example">
                            <div></div>
                            <div style={{backgroundColor: props.styleItself.color}}></div>
                        </div>
                        <h3>Right</h3>
                        <div className="select-bar" style={{backgroundColor: selected.rigthLayout}}></div>
                    </div>
                </div>
            </div>
            <div style={{backgroundColor: !props.themeProp ? '#fff' : '#504d75ff'}} className="customize-segment">
                <h2>Style</h2>
                <div className="sub-layout-segments-line">
                    <div className="sub-line-segment" onClick={() => {
                        setSelected({
                            ...selected,
                            filledOut: '#bec2d0',
                            underlined: 'transparent'
                        });
                        props.changeStyle({
                            ...props.styleItself,
                            filledOut: true,
                            underlined: false
                        });
                    }}>
                        <div className="style-subcontainer">
                            <div className="filed-out-segment" style={{
                                backgroundColor: props.styleItself.color ? props.styleItself.color : '#1b7c65',
                                color: props.setTextColor(props.styleItself.color)
                                }}>
                                <h3>Text</h3>
                            </div>
                            <h4>Filled</h4>
                        </div>
                        <div className="select-bar" style={{backgroundColor: selected.filledOut}}></div>
                    </div>
                    <div className="sub-line-segment" onClick={() => {
                        setSelected({
                            ...selected,
                            filledOut: 'transparent',
                            underlined: '#bec2d0'
                        });
                        props.changeStyle({
                            ...props.styleItself,
                            filledOut: false,
                            underlined: true
                        });
                    }}>

                        <div className="style-subcontainer">
                            <div className="lined-out-segment">
                                <h3>Text</h3>
                            </div>
                            <h4>Underlined</h4>
                        </div>
                        <div className="select-bar" style={{backgroundColor: selected.underlined}}></div>
                    </div>
                </div>
            </div>
            <div style={{backgroundColor: !props.themeProp ? '#fff' : '#504d75ff'}} className="customize-segment">
                <h2>Color</h2>
                <div className="sub-color-segment">
                    <h3>Accent Color</h3>
                    <input type='color' className='color-picker' value={props.styleItself.color} onChange={(e) => {
                        props.changeStyle({
                            ...props.styleItself,
                            color: e.target.value
                        });
                    }} />
                </div>
            </div>
            <div style={{backgroundColor: !props.themeProp ? '#fff' : '#504d75ff'}} className="customize-segment">
                <h2>Fonts</h2>
                <div className="sub-fonts-segments">
                    <div className='font-segment-wrapper' onClick={() => {
                        props.changeStyle({
                            ...props.styleItself,
                            font: `Calibri`
                        });
                        setSelected({
                            ...selected,
                            calibriFont: '#bec2d0',
                            tnr: 'transparent',
                            arial: 'transparent',
                            sans: 'transparent'
                        });
                    }}>
                        <div className="font-segment calibri">
                            <h2>Aa</h2>
                            <h4>Calibri</h4>
                        </div>
                        <div className="select-bar" style={{backgroundColor: selected.calibriFont}}></div>
                    </div>
                    <div className="font-segment-wrapper" onClick={() => {
                        props.changeStyle({
                            ...props.styleItself,
                            font: `Times New Roman`
                        });
                        setSelected({
                            ...selected,
                            calibriFont: 'transparent',
                            tnr: '#bec2d9',
                            arial: 'transparent',
                            sans: 'transparent'
                        });
                    }}>
                        <div className="font-segment tnr">
                            <h2>Aa</h2>
                            <h4>Times New Roman</h4>
                        </div>
                        <div className="select-bar" style={{backgroundColor: selected.tnr}}></div>
                    </div>
                    <div className="font-segment-wrapper" onClick={() => {
                        props.changeStyle({
                            ...props.styleItself,
                            font: `Arial`
                        });
                        setSelected({
                            ...selected,
                            calibriFont: 'transparent',
                            tnr: 'transparent',
                            arial: '#bec2d0',
                            sans: 'transparent'
                        });
                    }}>
                        <div className="font-segment arial">
                            <h2>Aa</h2>
                            <h4>Arial</h4>
                        </div>
                        <div className="select-bar" style={{backgroundColor: selected.arial}}></div>
                    </div>
                    <div className="font-segment-wrapper" onClick={() => {
                        props.changeStyle({
                            ...props.styleItself,
                            font: `Roboto`
                        });
                        setSelected({
                            ...selected,
                            calibriFont: 'transparent',
                            tnr: 'transparent',
                            arial: 'transparent',
                            sans: '#bec2d0'
                        });
                    }}>
                        <div className="font-segment sans-sarif">
                            <h2>Aa</h2>
                            <h4>Roboto</h4>
                        </div>
                        <div className="select-bar" style={{backgroundColor: selected.sans}}></div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default CutomizeComponentDiv;