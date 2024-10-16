import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface InputDateTimeProps {
  selectedDate: Date | null
  onChange: (date: Date | null) => void
}

const InputDateTime: React.FC<InputDateTimeProps> = ({ selectedDate, onChange }) => {
  return (
    <DatePicker
      dateFormat="yyyy年MM月dd日 HH:mm"
      selected={selectedDate}
      onChange={(date) => onChange(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      placeholderText='日付を選択'
    />
  );
};

export default InputDateTime;
