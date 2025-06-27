// 🏢 STAYArta Command Center Integration
// Direct connection with STAYArta enterprise systems

const fs = require('fs').promises;
const path = require('path');

class STAYArtaIntegration {
    constructor() {
        this.commandCenterPath = '/Users/carlos/Documents/STAYArta_Command_Center';
        this.automationStatus = null;
        this.lastSync = new Date();
    }

    async getAutomationStatus() {
        try {
            const statusPath = path.join(this.commandCenterPath, 
                '08_COLLABORATION/Claude_Workspace/Automation_Scripts/Logs/automation_status.json');
            const statusData = await fs.readFile(statusPath, 'utf8');
            this.automationStatus = JSON.parse(statusData);
            return this.automationStatus;
        } catch (error) {
            return { status: 'error', message: 'Could not read automation status' };
        }
    }

    async getProjectsSummary() {
        try {
            const projectsPath = path.join(this.commandCenterPath, '05_PROJECTS');
            const activeProjects = await fs.readdir(path.join(projectsPath, 'Active_Projects'));
            const completedProjects = await fs.readdir(path.join(projectsPath, 'Completed_Projects'));
            
            return {
                active: activeProjects.length,
                completed: completedProjects.length,
                total: activeProjects.length + completedProjects.length,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            return { error: 'Could not access projects data' };
        }
    }

    async getFinancialSummary() {
        try {
            const financialsPath = path.join(this.commandCenterPath, '03_FINANCIALS');
            const directories = await fs.readdir(financialsPath);
            
            return {
                modules: directories.filter(dir => !dir.startsWith('.')),
                hasUSAAccount: directories.includes('Banking_Statements'),
                hasVenezuelaAccount: directories.includes('Banking_Statements'),
                lastSync: this.lastSync.toISOString()
            };
        } catch (error) {
            return { error: 'Could not access financial data' };
        }
    }

    async createTelegramResponse(query) {
        const automation = await this.getAutomationStatus();
        const projects = await this.getProjectsSummary();
        const financials = await this.getFinancialSummary();

        let response = "🏢 *STAYArta Command Center Status*\\n\\n";
        
        if (automation.status === 'FULLY_AUTOMATED') {
            response += "✅ *Automatización:* ACTIVA\\n";
            response += `🤖 *Sistemas:* ${Object.keys(automation.systems).length} operativos\\n`;
        }
        
        response += `📊 *Proyectos:* ${projects.active} activos, ${projects.completed} completados\\n`;
        response += `💰 *Finanzas:* ${financials.modules ? financials.modules.length : 0} módulos\\n`;
        response += `⏰ *Última sincronización:* ${new Date().toLocaleString()}\\n\\n`;
        response += "_Optimizando tu día con STAYArta_ ⚡";

        return response;
    }

    async logBotActivity(userId, message, response) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                userId: userId,
                message: message,
                response: response.substring(0, 100) + '...',
                source: 'NovaSTAYBot'
            };

            const logPath = path.join(this.commandCenterPath, 
                '08_COLLABORATION/Claude_Workspace/bot_activity.json');
            
            let logs = [];
            try {
                const existingLogs = await fs.readFile(logPath, 'utf8');
                logs = JSON.parse(existingLogs);
            } catch (e) {
                // File doesn't exist, start fresh
            }

            logs.push(logEntry);
            
            // Keep only last 100 entries
            if (logs.length > 100) {
                logs = logs.slice(-100);
            }

            await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
            return true;
        } catch (error) {
            console.error('Could not log bot activity:', error);
            return false;
        }
    }
}

module.exports = STAYArtaIntegration;
