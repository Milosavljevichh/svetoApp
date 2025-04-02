export default function NewResponseButton({refreshContent, previousUserContent, selectedLang}){
    function regeneratePrompt(){
        console.log(previousUserContent)
        refreshContent(previousUserContent, selectedLang)
    }
    return(
        <button
        onClick={() => regeneratePrompt()}
        className="bg-[#8b4513] text-white p-2 rounded-lg transform transition hover:scale-105 flex items-center justify-center mb-6"
        >
       <i className="fa-solid fa-rotate-left"></i>
    </button>
    )
}