document.addEventListener("DOMContentLoaded", function () {

    const chatForm = document.getElementById("chatForm");
    const userMessage = document.getElementById("userMessage");
    const chatMessages = document.getElementById("chatMessages");
    const sendMessage = document.getElementById("sendMessage");
    const suggestionButtons =
        document.querySelectorAll(".suggestion-btn");


    // ==========================================
    // GET SAVED LANGUAGE
    // ==========================================

    function getLanguage() {

        return localStorage.getItem("femoraLanguage") || "en";

    }


    // ==========================================
    // ADD MESSAGE
    // ==========================================

    function addMessage(message, type) {

        const messageDiv = document.createElement("div");

        messageDiv.className =
            type === "user"
                ? "user-message"
                : "ai-message";


        if (type === "user") {

            messageDiv.innerHTML = `

                <div class="message-content">

                    <strong>You</strong>

                    <p></p>

                </div>

            `;

        } else {

            messageDiv.innerHTML = `

                <div class="message-icon">
                    🤖
                </div>

                <div class="message-content">

                    <strong>Femora AI</strong>

                    <p></p>

                </div>

            `;

        }


        const paragraph =
            messageDiv.querySelector("p");

        paragraph.textContent = message;


        chatMessages.appendChild(messageDiv);


        chatMessages.scrollTop =
            chatMessages.scrollHeight;


        return messageDiv;

    }


    // ==========================================
    // TYPING MESSAGE
    // ==========================================

    function addTypingMessage() {

        const messageDiv =
            document.createElement("div");

        messageDiv.className = "ai-message";

        messageDiv.innerHTML = `

            <div class="message-icon">
                🤖
            </div>

            <div class="message-content">

                <strong>Femora AI</strong>

                <p>
                    <span class="typing">
                        ● ● ●
                    </span>
                </p>

            </div>

        `;

        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

        return messageDiv;

    }


    // ==========================================
    // SEND QUESTION
    // ==========================================

    async function askAI(question) {

        if (!question.trim()) {
            return;
        }


        const language = getLanguage();


        // Show user message

        addMessage(question, "user");


        // Clear input

        userMessage.value = "";


        // Disable button

        sendMessage.disabled = true;


        // Typing indicator

        const typingMessage =
            addTypingMessage();


        try {

            const response = await
             fetch("/.netlify/functions/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message: question,

                        language: language

                    })

                }
            );


            const data =
                await response.json();


            // Remove typing indicator

            typingMessage.remove();


            if (data.success) {

                addMessage(
                    data.reply,
                    "ai"
                );

            } else {

                const errorText =
                    language === "ur"

                        ? "معذرت، Femora AI اس وقت جواب نہیں دے سکا۔ براہِ کرم دوبارہ کوشش کریں۔"

                        : "Sorry, Femora AI could not respond right now. Please try again.";


                addMessage(
                    errorText,
                    "ai"
                );

                console.error(
                    "Femora AI Error:",
                    data.message
                );

            }


        } catch (error) {

            typingMessage.remove();


            const errorText =
                language === "ur"

                    ? "معذرت، AI سے رابطہ نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔"

                    : "Sorry, I couldn't connect to Femora AI. Please try again.";


            addMessage(
                errorText,
                "ai"
            );


            console.error(
                "Connection Error:",
                error
            );

        }


        // Enable button

        sendMessage.disabled = false;

        userMessage.focus();

    }


    // ==========================================
    // FORM SUBMIT
    // ==========================================

    if (chatForm) {

        chatForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const question =
                    userMessage.value.trim();

                askAI(question);

            }
        );

    }


    // ==========================================
    // SUGGESTED QUESTIONS
    // ==========================================

    suggestionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const language =
                        getLanguage();


                    let question;


                    if (language === "ur") {

                        question =
                            button.dataset.questionUr;

                    } else {

                        question =
                            button.dataset.questionEn;

                    }


                    if (question) {

                        userMessage.value =
                            question;

                        userMessage.focus();

                    }

                }
            );

        }
    );


});
