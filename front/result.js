// resultatsiden: viser poeng og hvert svar
const scoreText = document.querySelector("#score")
const msgText = document.querySelector("#msg")
const resultList = document.querySelector("#resultList")
const savedResualt = sessionStorage.getItem("result") // tekst fra quiz.js, eller null hvis den ikke finnes
const savedAnswears = sessionStorage.getItem("answers") // også tekst eller null



if(!savedResualt){
    window.location = "./"
} else {
    const resualt = JSON.parse(savedResualt)
    // {results: [{id: 1, correct: true, rightAnswer: "Jupiter", feedback: "Helt riktig!"}, ...]}

    const results = resualt.results // [{id: 1, correct: true, rightAnswer: "Jupiter", feedback: "Helt riktig!"}, ...]
    let poeng = 0 // antall riktige

    results.forEach((r, i) => { // r = {id: 1, correct: true, rightAnswer: "Jupiter", feedback: "Helt riktig!"}, i = 0, 1, 2...
        if(r.correct){
            poeng++
        }
        const answears = savedAnswears ? JSON.parse(savedAnswears) : [] // [{id: 1, question: "Hva er den største planeten?", userAnswer: "Jupiter"}, ...]
        // finner spørsmålet og svaret med samme id
        const answ = answears.find(a => a.id == r.id) // {id: 1, question: "Hva er den største planeten?", userAnswer: "Jupiter"}

        const div = document.createElement("div")
        div.classList.add("answer")
        // grønn eller rød strek (css i result.html)
        if(r.correct){
            div.classList.add("right")
        } else {
            div.classList.add("wrong")
        }

        const status = document.createElement("p")
        status.classList.add("status")
        status.textContent = r.correct ? "Riktig" : "Feil"

        const qustion = document.createElement("h3")
        qustion.textContent = (i + 1) + ". " + (answ ? answ.question : "")

        const userAnsw = document.createElement("p")
        if(answ && answ.userAnswer){
            userAnsw.textContent = "Ditt svar: " + answ.userAnswer
        } else {
            userAnsw.textContent = "Ditt svar: -"
        }

        div.append(status)
        div.append(qustion)
        div.append(userAnsw)

        // viser riktig svar bare hvis svaret er feil
        if(!r.correct){
            const right = document.createElement("p")
            right.textContent = "Riktig svar: " + r.rightAnswer
            div.append(right)
        }

        const feedback = document.createElement("p")
        feedback.classList.add("feedback")
        feedback.textContent = r.feedback
        div.append(feedback)

        resultList.append(div)
    })

    scoreText.textContent = poeng + " / " + results.length

    if(poeng == results.length){
        msgText.textContent = "Alt riktig! Bra jobba!"
    } else if(poeng >= results.length / 2){
        msgText.textContent = "Bra jobba! Her er svarene dine:"
    } else {
        msgText.textContent = "Det kan bli bedre. Her er svarene dine:"
    }
}
