// 🤖 NovaSTAYBot AI Integration Module
// Enhanced capabilities for STAYArta ecosystem

const { OpenAI } = require('openai');

class AIIntegration {
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
        this.stayartaContext = {
            company: "STAYArta",
            mission: "Optimiza tu día con tecnología útil",
            services: ["Desarrollo Web", "Automatización", "IA Solutions", "E-commerce"]
        };
    }

    async processMessage(message, userContext) {
        try {
            // Enhanced message processing with STAYArta context
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system", 
                        content: `Eres NovaSTAY, el asistente IA de STAYArta. 
                        Tu misión es ayudar a optimizar el día de los usuarios con tecnología útil.
                        STAYArta ofrece: ${this.stayartaContext.services.join(", ")}.
                        Siempre responde con el branding STAYArta y enfócate en soluciones tecnológicas prácticas.`
                    },
                    { role: "user", content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            });

            return {
                response: response.choices[0].message.content,
                context: this.stayartaContext,
                processed: true
            };
        } catch (error) {
            return {
                response: "⚡ STAYArta está optimizando la respuesta. Intenta nuevamente.",
                error: error.message,
                processed: false
            };
        }
    }

    async generateSTAYArtaInsight(topic) {
        // Generate business insights for STAYArta
        const prompt = `Como experto en ${topic} para STAYArta, genera insights prácticos y accionables que ayuden a optimizar procesos empresariales.`;
        
        return await this.processMessage(prompt, { type: 'business_insight' });
    }

    async createAutomationSuggestion(userQuery) {
        // Suggest automation solutions
        const prompt = `El usuario pregunta: "${userQuery}". Sugiere una solución de automatización práctica usando tecnología STAYArta.`;
        
        return await this.processMessage(prompt, { type: 'automation_suggestion' });
    }
}

module.exports = AIIntegration;
