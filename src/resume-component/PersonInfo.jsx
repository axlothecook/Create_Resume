import './resumeComponents.css';
import PhoneSvg from '../components/Phone';
import LocationSvg from '../components/Location';
import EmailSvg from '../components/Email';

const PersonInfoDiv = (props) => {
    return (
      <div className={props.assertStyle.personalInfoBox} style={{
          padding: (props.assertStyle.gridView ? '50px 20px' : props.assertStyle.underlined ? '10px 10px 0 10px' : '10px'),
          backgroundColor: (props.assertStyle.underlined ? 'transparent' : props.assertStyle.color),
          borderRight: (props.assertStyle.personalInfoBox === 'personal-info-box-left' ? '1px solid black' : 'none'),
          borderLeft: (props.assertStyle.personalInfoBox === 'personal-info-box-right' ? '1px solid black' : 'none')
        }}>
          <h1 style={{
            fontFamily: props.assertStyle.font,
            color: (props.assertStyle.underlined ? 'black' : props.setSvgClr(props.assertStyle.color))
            }}>{props.object.fullname ? props.object.fullname : ''}
          </h1>
          <div className={props.assertStyle.personalInfoDetail} style={{ 
            paddingBottom: (props.assertStyle.gridView ? '6rem' : '0'),
            }}>
            <div className='details-box'>
              <EmailSvg color={(props.assertStyle.underlined ? 'black' : props.assertStyle.color)} setClr={props.setSvgClr} />
              <div>
                <h4 style={{
                  fontFamily: props.assertStyle.font,
                  color: (props.assertStyle.underlined ? 'black' : props.setSvgClr(props.assertStyle.color)),
                }}>{props.object.email ? props.object.email : ''}</h4>
              </div>
            </div>
            {!props.assertStyle.gridView && <div>|</div>}
            <div className='details-box'>
              <PhoneSvg color={(props.assertStyle.underlined ? 'black' : props.assertStyle.color)} setClr={props.setSvgClr} />
              <div style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
                <h4 style={{
                  fontFamily: props.assertStyle.font,
                  color: (props.assertStyle.underlined ? 'black' : props.setSvgClr(props.assertStyle.color))
                  }}>+{props.object.phoneNumber ? props.object.phoneNumber : ''}</h4>
              </div>
            </div>
            {!props.assertStyle.gridView && <div>|</div>}
            <div className='details-box'>
              <LocationSvg color={(props.assertStyle.underlined ? 'black' : props.assertStyle.color)} setClr={props.setSvgClr} />
              <div style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
                <h4 style={{
                  fontFamily: props.assertStyle.font,
                  color: (props.assertStyle.underlined ? 'black' : props.setSvgClr(props.assertStyle.color))
                  }}>{props.object.address ? props.object.address : ''}</h4>
              </div>
            </div>
          </div>
        {props.assertStyle.gridView && props.child }
        {props.assertStyle.underlined && <hr style={{width: '95%'}} />}
      </div>
    )
}

export default PersonInfoDiv;