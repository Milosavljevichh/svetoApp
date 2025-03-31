import { useTranslation } from 'react-i18next';
import '../i18n/i18n';

const useSuggestedQuestions = () => {

    const { t, i18n } = useTranslation();
    
    const generalQuestions = {
        title: t('homePage.questions.general.title'),
        questions:
    [
        {
          text: t('homePage.questions.general.q1'),
          icon: "fa fa-utensils",
        },
        {
          text:  t('homePage.questions.general.q2'),
          icon: "fa fa-pray",
        },
        {
          text:  t('homePage.questions.general.q3'),
          icon: "fa fa-image",
        },
        {
          text:  t('homePage.questions.general.q4'),
          icon: "fa fa-church",
        },
        {
          text:  t('homePage.questions.general.q5'),
          icon: "fa fa-cross",
        },
        {
          text:  t('homePage.questions.general.q6'),
          icon: "fa fa-book",
        },
      ]
    };
    const holidayQuestions = {
        title: t('homePage.questions.holiday.title'),
        questions: [
        {
        text: t('homePage.questions.holiday.q1'),
        icon: "fa fa-utensils",
        },
        {
        text:  t('homePage.questions.holiday.q2'),
        icon: "fa fa-pray",
        },
        {
        text:  t('homePage.questions.holiday.q3'),
        icon: "fa fa-image",
        },
        {
        text:  t('homePage.questions.holiday.q4'),
        icon: "fa fa-church",
        },
    ]
};

    return [generalQuestions, holidayQuestions]
}

export default useSuggestedQuestions