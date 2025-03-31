import { useState, cloneElement } from "react";
import SuggestedQuestions from "./SuggestedQuestions";
import useSuggestedQuestions from "../hooks/useSuggestedQuestions";

export default function RecommendationsDropdown({ setUserContent, setTextAreaContent }) {

  const [openIndex, setOpenIndex] = useState(null); // Track which dropdown is open
  const questionList = useSuggestedQuestions()

  const questions = questionList.map((q)=>{
    return { title: q.title, content: createQuestionElements(q.questions, setUserContent, setTextAreaContent)}
  })

  function toggleDropdown(index) {
    setOpenIndex(openIndex === index ? null : index); // Close if same, open if different
  }

  function createQuestionElements(list, user, textarea){
    return (
        <SuggestedQuestions suggestedQuestions={list} setUserContent={user} setTextAreaContent={textarea}/>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={index} className="border rounded-lg">
          {/* Dropdown Header */}
          <div
            className="text-left w-100 hover:cursor-pointer select-none flex items-center gap-2 p-3 rounded-lg border-2 border-[#8b4513] text-[#8b4513] hover:bg-[#8b4513] hover:text-white transition-colors flex items-center gap-2 font-crimson-text"
            onClick={() => toggleDropdown(index)}
          >
            <span>{question.title}</span>
            <i className={`fa-solid fa-chevron-${openIndex === index ? "up" : "down"}`}></i>
          </div>

          {/* Dropdown Content */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 overflow-hidden ${
              openIndex === index ? "max-h-[500px] opacity-100 p-4" : "max-h-0 opacity-0 p-0"
            }`}
          >
          {question.content}
          </div>
        </div>
      ))}
    </div>
  );
}
