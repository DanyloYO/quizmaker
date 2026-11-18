// startsiden: sender tema og antall til serveren og går videre til quizen
const onPlay = document.querySelector(".playBtn")
const quizForm = document.querySelector("#quizForm")
const errormsg = document.querySelector(".errormsg")

quizForm.addEventListener("submit", async (e)=>{
    e.preventDefault()

    // låser knappen så man ikke sender flere ganger mens AI lager spørsmål
    onPlay.disabled = true
    onPlay.textContent = "Lager spørsmål..."
    errormsg.style.display = "none"

    const formData = new FormData(quizForm)
    const data = Object.fromEntries(formData.entries()) // {topic: "Verdensrommet", count: "5"}
    console.log(data)
    try {
        // spør serveren om spørsmål (/questions i server.js)
        // uten / foran, så det virker både på localhost og på danilx.com/quiz/
        const sendTopCount = await fetch("questions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        })
        await sendTopCount.json().then(quest => {
            // quest = {qust: {questions: [{id: 1, question: "..."}]}} eller {error: "..."}
            console.log(quest)
            if(quest?.error){
                errormsg.innerHTML = quest.error
                errormsg.style.color = "red"
                errormsg.style.display = "block"
                onPlay.disabled = false
                onPlay.textContent = "Start"

            } else{
                // lagrer quizen så quiz.js kan bruke den på neste side
                sessionStorage.setItem("quiz", JSON.stringify(quest))
                window.location = "quiz"

            }

        })
    } catch(err) {
        console.log(err)
        errormsg.innerHTML = "Noe gikk galt, prøv igjen"
        errormsg.style.color = "red"
        errormsg.style.display = "block"
        onPlay.disabled = false
        onPlay.textContent = "Start"
    }

})
