import './resumeComponents.css';
import PhoneSvg from '../components/Phone';
import LocationSvg from '../components/Location';
import EmailSvg from '../components/Email';

const PersonInfoDiv = (props) => {
  // console.log('underlined:')
    return (
      <div className={props.assertStyle.personalInfoBox} style={{
          backgroundColor: (props.assertStyle.underlined ? 'transparent' : props.assertStyle.color),
          borderBottom: (props.assertStyle.underlined ?  (props.assertStyle.gridView ? 'none' : '1px solid black') : 'none'),
          borderRight: (props.assertStyle.underlined ?  ((props.assertStyle.personalInfoBox === 'personal-info-box-left') ? '1px solid black' : 'none') : 'none'),
          borderLeft: (props.assertStyle.underlined ?  ((props.assertStyle.personalInfoBox === 'personal-info-box-right') ? '1px solid black' : 'none') : 'none')
        }}>
          <h1 style={{
            fontFamily: props.assertStyle.font,
            color: (props.assertStyle.underlined ? 'black' : props.setSvgClr(props.assertStyle.color))
            }}>{props.personFullName}</h1>
          <div className={props.assertStyle.personalInfoDetail} style={{ 
            paddingBottom: (props.assertStyle.underlined ? (props.assertStyle.gridView ? '6rem' : '0') : 'none'), 
            borderBottom: (props.assertStyle.underlined ?  (props.assertStyle.gridView ? '1px solid black' : 'none') : 'none')}}>
            <div className='details-box'>
              <EmailSvg color={(props.assertStyle.underlined ? 'black' : props.assertStyle.color)} setClr={props.setSvgClr} />
              <h4 style={{
                fontFamily: props.assertStyle.font,
                color: (props.assertStyle.underlined ? 'black' : props.setSvgClr(props.assertStyle.color))
              }}>{props.personEmail}</h4>
            </div>
            {!props.assertStyle.gridView && <div>|</div>}
            <div className='details-box'>
              <PhoneSvg color={(props.assertStyle.underlined ? 'black' : props.assertStyle.color)} setClr={props.setSvgClr} />
              <h4 style={{
                fontFamily: props.assertStyle.font,
                color: (props.assertStyle.underlined ? 'black' : props.setSvgClr(props.assertStyle.color))
                }}>+{props.personPhone}</h4>
            </div>
            {!props.assertStyle.gridView && <div>|</div>}
            <div className='details-box'>
              <LocationSvg color={(props.assertStyle.underlined ? 'black' : props.assertStyle.color)} setClr={props.setSvgClr} />
              <h4 style={{
                fontFamily: props.assertStyle.font,
                color: (props.assertStyle.underlined ? 'black' : props.setSvgClr(props.assertStyle.color))
                }}>{props.personLocation}</h4>
            </div>
          </div>
        {props.assertStyle.gridView && props.child }
      </div>
    )
}

export default PersonInfoDiv;