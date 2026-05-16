const canvas =
document.getElementById(
    "whiteboardCanvas"
);

const ctx =
canvas.getContext("2d");

ctx.fillStyle = "white";

ctx.font = "28px Arial";

ctx.fillText(
    "AI Teacher Board Ready 🎓",
    40,
    60
);

async function startTeaching() {

    const question =
        document.getElementById(
            "teacherQuestion"
        ).value;

    const board =
        document.getElementById(
            "whiteboard"
        );

    const status =
        document.getElementById(
            "teacherStatus"
        );

    if (!question) {

        alert("Enter question");

        return;
    }

    board.innerHTML = "";

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";

    ctx.font = "28px Arial";

    status.innerText =
        "Teacher is preparing lesson...";

    try {

        const result =
            await tutorAPI(question);

        const answer =
            result.answer;

        const steps =
            answer.match(
                /[^\.!\?]+[\.!\?]+/g
            ) || [answer];

        status.innerText =
            "Teaching started 🎓";

        let index = 0;

        async function showStep() {

            if (index >= steps.length) {

                status.innerText =
                    "Lesson completed ✅";

                return;
            }

            const step =
                steps[index].trim();

            board.innerHTML +=
                "➜ " +
                step +
                "\n\n";

            board.scrollTop =
                board.scrollHeight;

            ctx.fillText(
                step,
                40,
                120 + (index * 50)
            );

            try {

                const response =
                    await fetch(

                        `${VOICE_TUTOR_URL}/generate`,

                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                prompt: step
                            })
                        }
                    );

                const data =
                    await response.json();

                const player =
                    new Audio(
                        `${VOICE_TUTOR_URL}${data.audio}`
                    );

                player.play();

                player.onended = () => {

                    index++;

                    showStep();
                };

            } catch (err) {

                console.error(err);

                index++;

                showStep();
            }
        }

        showStep();

    } catch (err) {

        console.error(err);

        status.innerText =
            "Teacher failed ❌";
    }
}
