import React, { useState } from 'react';
import './index.scss';

function App() {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [currentMonDate, setCurrentMonDate] = useState(new Date().getDay() === 0 ? test(new Date()) : nextDate(1 - 7));
    const [toDoListMap, setToDoListMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
    const [inputText, setInputText] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);

    function test(prevMonday) {
        if (prevMonday.getDay() === 1) {
            prevMonday.setDate(prevMonday.getDate() - 7);
            return prevMonday;
        }
        prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
        return prevMonday;
    }


    function nextDate(dayIndex, date = new Date()) {
        date.setDate(date.getDate() + (dayIndex - 1 - date.getDay() + 7) % 7 + 1);
        return date;
    }

    function onPrevButtonClick() {
        let a = test(new Date(currentMonDate));
        setCurrentMonDate(a); // 1 is day-index for Monday
    }

    function onNextButtonClick() {
        setCurrentMonDate(new Date(nextDate(1, currentMonDate))); // 1 is day-index for Monday
    }

    function onCreateClick() {
        if (selectedDate && inputText) {
            if (!toDoListMap[selectedDate]) {
                toDoListMap[selectedDate] = [];
            }
            toDoListMap[selectedDate].push(inputText);
            setToDoListMap(toDoListMap);
            setInputText('');
        }
    }

    function onDeleteClick() {
        if (selectedDate && toDoListMap[selectedDate]) {
            let updatedTodoList = JSON.parse(JSON.stringify(toDoListMap));
            delete updatedTodoList[selectedDate]
            setToDoListMap(updatedTodoList);
        }
    }

    function onDateSelect(selectedDate) {
        setSelectedDate(selectedDate);
    }

    function handleTextChange(e) {
        setInputText(e.target.value);
    }

    function handleMonthDropdownChange(e) {
        const firstDayOfMonth = new Date(new Date(new Date().getFullYear(), months.indexOf(e.target.value), 1));
        setSelectedDate(firstDayOfMonth.toDateString());
        let currenMondayOfFirstDayOfMonth = null;
        if (firstDayOfMonth.getDay() === 1) {
            currenMondayOfFirstDayOfMonth = firstDayOfMonth;
        } else if (firstDayOfMonth.getDay() > 1 || firstDayOfMonth.getDay() === 0) {
            currenMondayOfFirstDayOfMonth = test(firstDayOfMonth);
        }

        setSelectedMonth(e.target.value);
        setCurrentMonDate(currenMondayOfFirstDayOfMonth);

    }

    let temp = new Date(currentMonDate);
  
    return (
        <div className="weeklyCalendarWrapper"> 
            <div className="monthDropdownWrapper">
                <div className="monthName">{selectedMonth}</div>
                <div className="monthDropdown">
                    <select value={selectedMonth} onChange={handleMonthDropdownChange}>
                        {months.map(month => {
                            return <option value={month}>{month}</option>
                        })}
                    </select>
                </div>

            </div>

            <div className="weekDateWrapper">
                <div className='navButton' onClick={onPrevButtonClick}>{`<`}</div>
                <div className="dateContainer">
                    {weekDays.map((e, index) => {
                        const date = temp.getDate();
                        const dateStr = temp.toDateString();
                        const isToday = dateStr === new Date().toDateString();
                        temp.setDate(temp.getDate() + 1);
                        return (
                            <div className="week-day-wrapper" onClick={() => onDateSelect(dateStr)} key={dateStr}>
                                <span className='weekName'>{weekDays[index]}</span>
                                <span key={index} className={`weekDay ${isToday ? 'active' : ''} ${dateStr === selectedDate ? 'selectedDate' : ''}`}>{date}</span>
                            </div>)
                    })}
                </div>
                <div className='navButton next' onClick={onNextButtonClick}>{'>'}</div>
            </div>
            <div className='toDoListContainer'>
                <div className='heading'>
                    <div className="title">To Do</div>
                    <div className="toDoActions">
                        <div className="create-button" onClick={onCreateClick}>+ Create</div>
                        <div className="delete-button" onClick={onDeleteClick}>- Delete</div>
                    </div>

                </div>
                <div className="toDoInputBoxWrapper">
                    <input
                        type="text"
                        className='toDoInputBox'
                        value={inputText}
                        placeholder="Add todo's here"
                        onChange={handleTextChange}
                    />
                </div>
                <div className='content'>
                    {
                        toDoListMap[selectedDate] && toDoListMap[selectedDate].map(todoItem => {
                            return <span className='toDoItem'>{todoItem}</span>;
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
