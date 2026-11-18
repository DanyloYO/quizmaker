// quizsiden: viser spørsmålene og sender svarene til serveren
const answForm = document.querySelector("#answersForm")
const questionsBox = document.querySelector("#questions")
const doneBtn = document.querySelector(".doneBtn")
const saved = sessionStorage.getItem("quiz") // tekst fra index.js, eller null



if(!saved){
    // ingen quiz -> tilbake til startsiden
    window.location = "./"
} else {
    const quiz = JSON.parse(saved) // {qust: {questions: [{id: 1, question: "Hva er den største planeten?"}, ...]}}
    const questions = quiz.qust.questions
    // lager label + input for hvert spørsmål
    questions.forEach((q, i) => {
        const label = document.createElement("label")
        label.htmlFor = "q" + q.id
        label.textContent = (i + 1) + ". " + q.question

        const input = document.createElement("input")
        input.id = "q" + q.id
        input.name = q.id // så vi finner svaret med formData.get(q.id)
        input.type = "text"
        input.placeholder = "Ditt svar"

        questionsBox.append(label)
        questionsBox.append(input)
    })

    answForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const formData = new FormData(answForm)
        const answears = []

        questions.forEach((q) => {
            answears.push({
                id: q.id,
                question: q.question,
                userAnswer: formData.get(q.id).trim()
            })
        })

        console.log(answears) // [{id: 1, question: "...", userAnswer: "Jupiter"}, ...]

        // så man ikke trykker flere ganger mens AI sjekker
        doneBtn.disabled = true
        doneBtn.textContent = "Sjekker..."

        try {
            // serveren sender svarene til Claude og får tilbake hva som er riktig
            const sendAnsw = await fetch("check", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({answers: answears})
            })
            const resualt = await sendAnsw.json() // {results: [...]} eller {error: "..."}
            console.log(resualt)

            if(resualt?.error){
                alert(resualt.error)
                doneBtn.disabled = false
                doneBtn.textContent = "Ferdig"
            } else {
                // result.js trenger både resultatet og svarene
                sessionStorage.setItem("result", JSON.stringify(resualt))
                sessionStorage.setItem("answers", JSON.stringify(answears))
                window.location = "result"
            }
        } catch(err) {
            console.log(err)
            alert("Noe gikk galt, prøv igjen")
            doneBtn.disabled = false
            doneBtn.textContent = "Ferdig"
        }
    })
}
