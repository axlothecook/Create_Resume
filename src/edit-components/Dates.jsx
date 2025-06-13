import './resumeEditor.css';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Dates = (props) => {
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
                <div className='edit-title-box'>
                    <h4>End Date</h4>
                    <p>choose today's date for ongoing</p>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* defaultValue={props.initialEnd} */}
                    <DatePicker onChange={(e) => {
                        props.endDateonChange(e);
                    }} defaultValue={
                        !props.initialEnd ? dayjs('2022-04-16') : dayjs(props.initialEnd)} />
                </LocalizationProvider>
            </div>
        </div>
    )
}

export default Dates;