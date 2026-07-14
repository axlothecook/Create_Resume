import './resumeEditor.css';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Dates = (props) => {
    // Ongoing entries have no end date at all — the picker is disabled and the résumé
    // prints "present" instead. (Before this flag, "ongoing" meant "the end date is
    // today", which stopped being true the next day.)
    const ongoing = !!props.ongoing;

    return (
        <div className='start-end-date-boxes-parent'>
            <div className='edit-info-box'>
                <div className='edit-title-box-no-recommended'>
                    <h4>Start Date</h4>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker onChange={(e) => {
                        props.startDateonChange(e);
                    }} label={'MM/YYYY'} views={['month', 'year']} defaultValue={
                        !props.initialStart ? dayjs('2022-04-17') : dayjs(props.initialStart)} />
                </LocalizationProvider>
            </div>
            <div className='edit-info-box'>
                <div className='edit-title-box-no-recommended'>
                    <h4>End Date</h4>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* Month + year only, same as Start Date (the day was never shown in
                        the résumé, so asking for it only added a step). */}
                    <DatePicker
                        onChange={(e) => {
                            props.endDateonChange(e);
                        }}
                        label={'MM/YYYY'}
                        views={['month', 'year']}
                        disabled={ongoing}
                        defaultValue={
                            !props.initialEnd ? dayjs('2022-04-16') : dayjs(props.initialEnd)}
                    />
                </LocalizationProvider>
                <label className='ongoing-checkbox'>
                    <input
                        type='checkbox'
                        checked={ongoing}
                        onChange={(e) => props.onOngoingChange(e.target.checked)}
                    />
                    <span>Ongoing (shows as “present”)</span>
                </label>
            </div>
        </div>
    )
}

export default Dates;
