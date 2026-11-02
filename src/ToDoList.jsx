ToDoList.jsx

import React, { useState, useEffect } from "react"

// Reusable Tailwind class sets (small sizes first, larger sizes added with sm: and lg:)
const buttonBase = "font-bold text-white rounded-sm cursor-pointer transition-colors duration-300 min-h-[44px]";
const bigButton = `${buttonBase} px-5 py-2.5 text-lg sm:text-2xl`;
const smallButton = `${buttonBase} px-2 sm:px-3 py-2 text-base sm:text-lg`;
const greenColors = "bg-[#008000] hover:bg-[#207120]";
const redColors = "bg-[#ff0000] hover:bg-[#e30303]";
const blueColors = "bg-[#1e00b1] hover:bg-[#110487]";
const sortColors = "bg-[#007bff] hover:bg-[#0069d9]";
// 16px text on phones also stops iPhones from zooming in when you tap an input
const textInput = "w-full min-w-0 text-base sm:text-xl lg:text-[1.6rem] p-2.5 border-2 border-blue-700 text-blue-700";
const dateInput = "w-full sm:w-auto min-w-0 min-h-[44px] text-base p-2.5 border-2 border-blue-700 text-blue-700";

function ToDoList(){

    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("myTasks");
        if(savedTasks) {
             const parsed = JSON.parse(savedTasks); 
            //Automatically convert old text tasks into the new object format
            return parsed.map(task => typeof task === "string" ? { text: task, completed: false } : task);
        }
        return [];
    });

    //State variables
    const [newTask, setNewTask] = useState("");
    const [newDate, setNewDate] = useState("");
    //New Added feature | 11-01-2026
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [editDate, setEditDate] = useState("");
    

    //Auto Save data
    useEffect(() => {
        localStorage.setItem("myTasks", JSON.stringify(tasks));
    }, [tasks]);

    function handleInputChange(event){
       setNewTask(event.target.value);   
    }

    function addTask(){
        if(newTask.trim() !== ""){
            setTasks(t => [...t, { text: newTask, completed: false, date: newDate }]);
            setNewTask("");
            setNewDate(""); //Reset the date picker
        }
     }

    function deleteTask(index){
        const updatedTasks = tasks.filter((element, i) => i !== index);
        setTasks(updatedTasks);
    }

    function startEdit(index) {
        setEditIndex(index);
        setEditText(tasks[index].text || tasks[index] || ""); //Put the current task text into the edit box
        setEditDate(tasks[index].date || ""); 
    }

    function saveEdit(index) {
        const updatedTasks = [...tasks];
        updatedTasks[index] = {
            ...updatedTasks[index],
            text: editText,
            date: editDate
        };

        setTasks(updatedTasks);
        setEditIndex(null);
    }

    function toggleComplete(index) {
        const updatedTasks = [...tasks];
        //Flip the true/false value of the clicked task
        updatedTasks[index] = {...updatedTasks[index], completed: !updatedTasks[index].completed };
        setTasks(updatedTasks);
    }

    function moveTaskUp(index){
        if(index > 0 ){
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = 
            [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index){
         if(index < tasks.length - 1){
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = 
            [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function sortTasksByDate(){
        const sortedTasks = [...tasks].sort((a, b) => {
            //If neither task has a date, keep their current order
            if(!a.date && !b.date) return 0;
            // If task 'a' has no date, push it to the bottom
            if (!a.date) return 1;
            // If task 'b' has no date, push it to the bottom
            if (!b.date) return -1;

            // If both have dates, compare them to sort chronologically
            return new Date(a.date) - new Date(b.date);
        });

        setTasks(sortedTasks);
    }

    return (
        <div className="min-h-screen bg-[#d6f5ff] font-['Times_New_Roman',Times,serif] text-center px-3 sm:px-6 pt-10 sm:pt-16 lg:pt-24 pb-10">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">To-Do-List</h1>

            {/* Add row: stacked on phones, one wrapping row from 640px up */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-center gap-3 max-w-4xl 2xl:max-w-5xl mx-auto mb-6 sm:mb-8">
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                        if(event.key === "Enter"){
                            addTask();
                        }
                    }}
                    className={`${textInput} sm:w-auto sm:flex-1 sm:min-w-[14rem]`}
                />

                <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    aria-label="Due date"
                    className={dateInput}
                />

                <div className="grid grid-cols-2 gap-3 sm:flex">
                    <button className={`${bigButton} ${greenColors}`} onClick={addTask}>
                        Add
                    </button>
                    <button className={`${bigButton} ${blueColors}`} onClick={sortTasksByDate}>
                        Sort By Date
                    </button>
                </div>
            </div>

            <ol className="max-w-4xl 2xl:max-w-5xl mx-auto">
                {tasks.map((task, index) => (
                    <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2.5 p-3 sm:p-4 text-left font-bold bg-[#eceaea] border border-blue-700 rounded-md"
                    >
                        {/*Conditional Rendering*/}
                        {editIndex === index ? (
                            //Show this if we are editing this specific task
                            <>
                                <input
                                    type="text"
                                    value={editText || ""}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(index); }}
                                    className={`${textInput} sm:flex-1 sm:w-auto`}
                                />

                                <input
                                    type="date"
                                    value={editDate || ""}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    aria-label="Due date"
                                    className={dateInput}
                                />

                                <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2.5">
                                    <button className={`${smallButton} ${greenColors}`} onClick={() => saveEdit(index)}>
                                        Save
                                    </button>
                                    <button className={`${smallButton} ${redColors}`} onClick={() => setEditIndex(null)}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            //Show this if we are not editing
                            <>
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <input
                                        type="checkbox"
                                        checked={task.completed || false}
                                        onChange={() => toggleComplete(index)}
                                        aria-label={`Mark "${task.text}" as done`}
                                        className="w-6 h-6 mt-1 shrink-0 cursor-pointer accent-green-700"
                                    />

                                    <span
                                        className={`min-w-0 break-words text-xl sm:text-2xl lg:text-3xl ${task.completed ? "line-through text-gray-500" : ""}`}
                                    >
                                        {task.text} {task.completed && "🏆"}

                                        {task.date && (
                                            <span className="block sm:inline mt-1 sm:mt-0 sm:ml-3 text-sm sm:text-base font-normal text-gray-600">
                                                📅 {task.date}
                                            </span>
                                        )}
                                    </span>
                                </div>

                                {/* 2 buttons per row on small phones, 4 in a row from 420px, inline from 640px */}
                                <div className="grid grid-cols-2 min-[420px]:grid-cols-4 gap-2 sm:flex sm:gap-2.5 sm:shrink-0">
                                    <button className={`${smallButton} ${greenColors}`} onClick={() => startEdit(index)}>
                                        Edit
                                    </button>
                                    <button className={`${smallButton} ${redColors}`} onClick={() => deleteTask(index)}>
                                        Delete
                                    </button>
                                    <button className={`${smallButton} ${blueColors}`} onClick={() => moveTaskUp(index)}>
                                        UP
                                    </button>
                                    <button className={`${smallButton} ${blueColors}`} onClick={() => moveTaskDown(index)}>
                                        DOWN
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ol>

        </div>
    );
}
export default ToDoList
