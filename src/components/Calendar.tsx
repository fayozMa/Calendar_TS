import { FC, useEffect, useRef, useState } from "react";
import leftIcon from "../assets/leftIcon.svg";
import rightIcon from "../assets/rightIcon.svg";

interface Note {
  id: number;
  title: string;
  date: string;
}

const Calendar: FC = () => {
  const [weekDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dates, setDates] = useState<(null | number)[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const dCount = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const d: (null | number)[] = [];
    let counter = 1;
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const weekDay = (firstDayOfMonth + 6) % 7;
    for (let i = 1; i <= 42; i++) {
      if (i <= weekDay) {
        d.push(null);
      } else if (counter > dCount) {
        d.push(null);
      } else {
        d.push(counter);
        counter++;
      }
    }

    setDates(d);
  }, [currentMonth]);

  const handlePrev = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNext = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleAddNote = () => {
    if (titleRef.current && dateRef.current) {
      const title = titleRef.current.value.trim();
      const date = dateRef.current.value.trim();
      if (title && date) {
        setNotes([
          ...notes,
          {
            id: Date.now(),
            title,
            date,
          },
        ]);
        setModalOpen(false);
        titleRef.current.value = "";
        dateRef.current.value = "";
      }
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const formatDate = (day: number) => {
    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="mt-20 relative">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-3">
          <span
            onClick={handlePrev}
            className="btn btn-outline w-12 hover:bg-transparent"
          >
            <img src={leftIcon} alt="Previous month" />
          </span>
          <span
            onClick={handleNext}
            className="btn btn-outline w-12 hover:bg-transparent"
          >
            <img src={rightIcon} alt="Next month" />
          </span>
        </div>
      </div>

      <div className="mt-5 flex justify-between flex-wrap">
        {weekDays.map((weekDay, index) => (
          <div className="font-bold text-xl text-center w-1/7" key={index}>
            <h3 className="text-center">{weekDay}</h3>
          </div>
        ))}

        {dates.map((date, index) => (
          <div
            className={`font-bold text-md text-center w-1/7 min-h-20 p-2 mt-2 border-gray-400 ${
              date ? "border" : ""
            }`}
            key={index}
          >
            <p className="text-right">{date}</p>
            {date &&
              notes
                .filter((note) => note.date === formatDate(date))
                .map((note) => (
                  <div
                    key={note.id}
                    className="bg-blue-100 rounded-md shadow-md p-2 mt-1 text-left flex justify-between items-center"
                  >
                    <span className="text-sm">{note.title}</span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 font-bold text-xs ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
          </div>
        ))}
      </div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-black text-white px-6 py-2 rounded shadow-md mt-5"
      >
        Add Note
      </button>

      <div className={`modal ${modalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Note</h3>
          <input
            ref={titleRef}
            type="text"
            placeholder="Note Title"
            className="input input-bordered w-full my-3"
          />
          <input
            ref={dateRef}
            type="date"
            className="input input-bordered w-full mb-3"
          />
          <div className="modal-action">
            <button
              onClick={handleAddNote}
              className="btn bg-black text-white"
            >
              Save
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
