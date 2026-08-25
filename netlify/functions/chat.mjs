export default async (req) => {

    // ==========================================
    // ONLY POST REQUESTS
    // ==========================================

    if (req.method !== "POST") {

        return new Response(
            JSON.stringify({
                success: false,
                message: "Only POST requests are allowed."
            }),
            {
                status: 405,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }


    try {

        // ==========================================
        // GET REQUEST DATA
        // ==========================================

        const body = await req.json();

        const userMessage =
            (body.message || "").trim();

        const language =
            body.language || "en";


        if (!userMessage) {

            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Please enter a question."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        // ==========================================
        // GROQ API KEY
        // ==========================================

        const apiKey =
            Netlify.env.get("GROQ_API_KEY");


        if (!apiKey) {

            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Groq API key is not configured."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        // ==========================================
        // LANGUAGE INSTRUCTION
        // ==========================================

        let languageInstruction;


        if (language === "ur") {

            languageInstruction = `
Answer the user in clear and natural Urdu.

Use simple Urdu that is easy for Pakistani users
to understand.

Common medical terms such as PCOS, pregnancy,
ovulation, hormones and menopause may remain
in English when that makes the answer clearer.
`;

        } else {

            languageInstruction = `
Answer the user in clear and simple English.
`;

        }


        // ==========================================
        // FEMORA AI SYSTEM PROMPT
        // ==========================================

        const systemPrompt = `

You are Femora AI, a women's health information assistant.

Your purpose is to provide helpful, educational,
safe and easy-to-understand information about
women's health.

You can discuss topics including:

- Menstrual health
- Periods
- PMS
- PCOS
- Pregnancy
- Fertility
- Ovulation
- Nutrition
- Mental wellbeing
- Menopause
- General women's health

IMPORTANT SAFETY RULES:

1. Provide general health information only.

2. Do not claim to diagnose a medical condition.

3. Do not prescribe prescription medicines.

4. Do not tell users to start or stop medication
   without professional medical advice.

5. If symptoms could indicate a serious or urgent
   medical problem, recommend seeking medical care.

6. Encourage users to consult a qualified healthcare
   professional when appropriate.

7. Never pretend to be a doctor.

8. Be respectful, supportive and non-judgmental.

9. Keep answers understandable and reasonably concise.

10. If the question is unrelated to women's health,
    politely explain that Femora AI focuses mainly
    on women's health.

${languageInstruction}

`;


        // ==========================================
        // GROQ REQUEST
        // ==========================================

        const groqResponse = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${apiKey}`

                },

                body: JSON.stringify({

                    model:
                        "llama-3.1-8b-instant",

                    messages: [

                        {
                            role: "system",
                            content: systemPrompt
                        },

                        {
                            role: "user",
                            content: userMessage
                        }

                    ],

                    temperature: 0.4,

                    max_tokens: 700

                })

            }
        );


        // ==========================================
        // READ GROQ RESPONSE
        // ==========================================

        const result =
            await groqResponse.json();


        // ==========================================
        // GROQ ERROR
        // ==========================================

        if (!groqResponse.ok) {

            console.error(
                "Groq API Error:",
                result
            );


            return new Response(
                JSON.stringify({

                    success: false,

                    message:
                        result?.error?.message ||
                        "Groq API request failed."

                }),
                {
                    status: 500,

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        }


        // ==========================================
        // GET AI RESPONSE
        // ==========================================

        const reply =
            result?.choices?.[0]?.message?.content;


        if (!reply) {

            return new Response(
                JSON.stringify({

                    success: false,

                    message:
                        "Femora AI did not return a response."

                }),
                {
                    status: 500,

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        return new Response(

            JSON.stringify({

                success: true,

                reply: reply

            }),

            {

                status: 200,

                headers: {

                    "Content-Type":
                        "application/json"

                }

            }

        );


    } catch (error) {

        console.error(
            "Femora Function Error:",
            error
        );


        return new Response(

            JSON.stringify({

                success: false,

                message:
                    "Unable to connect to Femora AI right now."

            }),

            {

                status: 500,

                headers: {

                    "Content-Type":
                        "application/json"

                }

            }

        );

    }

};
