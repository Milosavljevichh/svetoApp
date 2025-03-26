import { useTranslation } from 'react-i18next';
import '../i18n/i18n';

function SuggestedQuestions({setUserContent, setTextAreaContent}) {

  const { t, i18n } = useTranslation();
    
    const suggestedQuestions = [
    {
      text: t('homePage.questions.q1'),
      icon: "fa fa-utensils",
    },
    {
      text:  t('homePage.questions.q2'),
      icon: "fa fa-pray",
    },
    {
      text:  t('homePage.questions.q3'),
      icon: "fa fa-image",
    },
    {
      text:  t('homePage.questions.q4'),
      icon: "fa fa-church",
    },
    {
      text:  t('homePage.questions.q5'),
      icon: "fa fa-cross",
    },
    {
      text:  t('homePage.questions.q6'),
      icon: "fa fa-book",
    },
  ];

    return(
        <>
        {suggestedQuestions.map((question, index) => (
            <button
            key={index}
            onClick={() => {
                setUserContent(question.text); 
                setTextAreaContent("")
            }}
            className="text-left p-3 rounded-lg border-2 border-[#8b4513] text-[#8b4513] hover:bg-[#8b4513] hover:text-white transition-colors flex items-center gap-2 font-crimson-text"
            >
            <i className={question.icon}></i>
            <span>{question.text}</span>
            </button>
        ))}
        </>
    )
}

export default SuggestedQuestions;