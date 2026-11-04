import React, { useState, useEffect } from "react"

// Reusable Tailwind class sets (small sizes first, larger sizes added with sm: and lg:)
// ADDED: focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 to make keyboard tabbing visible
const buttonBase = "font-bold text-white rounded-sm cursor-pointer transition-colors duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2";
const bigButton = `${buttonBase} px-5 py-2.5 text-lg sm:text-2xl`;
const smallButton = `${buttonBase} px-2 sm:px-3 py-2 text-base sm:text-lg`;
const greenColors = "bg-[#008000] hover:bg-[#207120]";
const redColors = "bg-[#ff0000] hover:bg-[#e30303]";
const blueColors = "bg-[#1e00b1] hover:bg-[#110487]";
const sortColors = "bg-[#007bff] hover:bg-[#0069d9]";

// ADDED: focus:ring styling for inputs
const textInput = "w-full min-w-0 text-base sm:text-xl lg:text-[1.6rem] p-2.5 border-2 border-blue-700 text-blue-700 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900";
const dateInput = "w-full sm:w-auto min-w-0 min-h-[44px] text-base p-2.5 border-2 border-blue-700 text-blue-700 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900";

function ToDoList(){

    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("myTasks");
        if(savedTasks) {
             const parsed = JSON.parse(savedTasks); 
            return parsed.map(task => typeof task === "string" ? { text: task, completed: false } : task);
        }
        return [];
    });

    const [newTask, setNewTask] = useState("");
    const [newDate, setNewDate] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [editDate, setEditDate] = useState("");
    
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
            setNewDate(""); 
        }
     }

    function deleteTask(index){
        const updatedTasks = tasks.filter((element, i) => i !== index);
        setTasks(updatedTasks);
    }

    function startEdit(index) {
        setEditIndex(index);
        setEditText(tasks[index].text || tasks[index] || ""); 
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
        updatedTasks[index] = {...updatedTasks[index], completed: !updatedTasks[index].completed };
        setTasks(updatedTasks);
    }

    function moveTaskUp(index){
        if(index > 0 ){
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index){
         if(index < tasks.length - 1){
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function sortTasksByDate(){
        const sortedTasks = [...tasks].sort((a, b) => {
            if(!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(a.date) - new Date(b.date);
        });
        setTasks(sortedTasks);
    }

    return (
        <div className="min-h-screen bg-[#d6f5ff] font-['Times_New_Roman',Times,serif] text-center px-3 sm:px-6 pt-10 sm:pt-16 lg:pt-24 pb-10">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">To-Do-List</h1>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-center gap-3 max-w-4xl 2xl:max-w-5xl mx-auto mb-6 sm:mb-8">
                <input
                    type="text"
                    aria-label="Enter a new task"
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
                    aria-label="Due date for new task"
                    className={dateInput}
                />

                <div className="grid grid-cols-2 gap-3 sm:flex">
                    <button 
                        className={`${bigButton} ${greenColors}`} 
                        onClick={addTask}
                        aria-label="Add new task"
                    >
                        Add
                    </button>
                    <button 
                        className={`${bigButton} ${blueColors}`} 
                        onClick={sortTasksByDate}
                        aria-label="Sort all tasks chronologically by date"
                    >
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
                        {editIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editText || ""}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(index); }}
                                    aria-label="Edit task text"
                                    className={`${textInput} sm:flex-1 sm:w-auto`}
                                />

                                <input
                                    type="date"
                                    value={editDate || ""}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    aria-label="Edit task due date"
                                    className={dateInput}
                                />

                                <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2.5">
                                    <button 
                                        className={`${smallButton} ${greenColors}`} 
                                        onClick={() => saveEdit(index)}
                                        aria-label={`Save edits to task: ${task.text}`}
                                    >
                                        Save
                                    </button>
                                    <button 
                                        className={`${smallButton} ${redColors}`} 
                                        onClick={() => setEditIndex(null)}
                                        aria-label="Cancel editing"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Changed from div to label to link checkbox and text */}
                                <label className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={task.completed || false}
                                        onChange={() => toggleComplete(index)}
                                        aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'completed'}`}
                                        className="w-6 h-6 mt-1 shrink-0 cursor-pointer accent-green-700 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
                                    />

                                    <span
                                        className={`min-w-0 break-words text-xl sm:text-2xl lg:text-3xl transition-colors ${task.completed ? "line-through text-gray-500" : ""}`}
                                    >
                                        {task.text} {task.completed && <span aria-hidden="true">🏆</span>}

                                        {task.date && (
                                            <span className="block sm:inline mt-1 sm:mt-0 sm:ml-3 text-sm sm:text-base font-normal text-gray-600">
                                                <span aria-hidden="true">📅</span> {task.date}
                                                <span className="sr-only">Due date: {task.date}</span>
                                            </span>
                                        )}
                                    </span>
                                </label>

                                <div className="grid grid-cols-2 min-[420px]:grid-cols-4 gap-2 sm:flex sm:gap-2.5 sm:shrink-0">
                                    <button 
                                        className={`${smallButton} ${greenColors}`} 
                                        onClick={() => startEdit(index)}
                                        aria-label={`Edit task: ${task.text}`}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className={`${smallButton} ${redColors}`} 
                                        onClick={() => deleteTask(index)}
                                        aria-label={`Delete task: ${task.text}`}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className={`${smallButton} ${blueColors}`} 
                                        onClick={() => moveTaskUp(index)}
                                        aria-label={`Move task "${task.text}" up`}
                                    >
                                        UP
                                    </button>
                                    <button 
                                        className={`${smallButton} ${blueColors}`} 
                                        onClick={() => moveTaskDown(index)}
                                        aria-label={`Move task "${task.text}" down`}
                                    >
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
export default ToDoList;