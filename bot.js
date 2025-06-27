require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN || '7515950614:AAHvctxL9KwS__O9ZVRAEkXY6OKtslyS5n4');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const BRAND = {
  name: 'NovaSTAYBot', company: 'STAYArta', tagline: 'Hack the ordinary',
  user: 'carlos', system: 'macOS'
};

const mainMenu = Markup.keyboard([
  ['📸 Foto', '💬 Texto', '🔗 Botón'],
  ['👁️ Preview', '🚀 Enviar', '📊 Stats'],
  ['🍎 Mac', '⚙️ Status']
]).resize().persistent();

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy', bot: BRAND.name, company: BRAND.company,
    user: BRAND.user, system: BRAND.system, uptime: Math.floor(process.uptime()),
    webhook_configured: !!process.env.WEBHOOK_URL, version: '2.0.0'
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>🤖 ${BRAND.name}</h1><h2>by ${BRAND.company}</h2>
    <p><strong>Status:</strong> ✅ Online</p><p><strong>User:</strong> ${BRAND.user}</p>
    <p><strong>System:</strong> ${BRAND.system}</p><p><strong>Tagline:</strong> ${BRAND.tagline}</p>
    <p><a href="/health">Health Check</a></p><p>🍎 Deployed from macOS by carlos</p>
  `);
});

app.post('/webhook', (req, res) => { bot.handleUpdate(req.body); res.sendStatus(200); });

bot.start(async (ctx) => {
  const welcome = `🤖 *${BRAND.name}*\n\n🏢 *${BRAND.company}*\n⭐ ${BRAND.tagline}\n\n` +
    `✨ *Deploy Info:*\n👤 User: ${BRAND.user}\n🍎 System: ${BRAND.system}\n🌐 Platform: Railway\n⚡ Status: Online 24/7\n\n` +
    `🎯 *Features:*\n• Content automation\n• Multi-platform posting\n• Make.com integration\n• Real-time analytics\n\nUsa el menú:`;
  
  await ctx.reply(welcome, { parse_mode: 'Markdown', ...mainMenu });
});

bot.command('status', async (ctx) => {
  const status = `📊 *${BRAND.name} Status*\n\n✅ Online\n🏢 ${BRAND.company}\n👤 ${BRAND.user}\n🍎 ${BRAND.system}\n` +
    `🌐 ${process.env.WEBHOOK_URL || 'Configurando...'}\n⏰ Uptime: ${Math.floor(process.uptime())}s\n🚀 Ready for automation!`;
  
  await ctx.reply(status, { parse_mode: 'Markdown', ...mainMenu });
});

bot.hears('🍎 Mac', async (ctx) => {
  const macInfo = `🍎 *macOS Deployment*\n\n👤 Usuario: ${BRAND.user}\n💻 Sistema: ${BRAND.system}\n` +
    `📦 Node.js: ${process.version}\n🚀 Platform: Railway\n⚡ Uptime: ${Math.floor(process.uptime())}s\n\n` +
    `✨ Deployed with Mac power! 🍎`;
  
  await ctx.reply(macInfo, { parse_mode: 'Markdown', ...mainMenu });
});

bot.hears('📸 Foto', (ctx) => ctx.reply('⚙️ Envía tu foto:', mainMenu));
bot.hears('💬 Texto', (ctx) => ctx.reply('⚙️ Escribe tu mensaje:', mainMenu));
bot.hears('🔗 Botón', (ctx) => ctx.reply('⚙️ Formato: `Texto | URL`', { parse_mode: 'Markdown', ...mainMenu }));
bot.hears('📊 Stats', (ctx) => {
  const stats = `📊 *Estadísticas*\n\n🤖 Bot: ${BRAND.name}\n👤 Usuario: ${ctx.from.first_name}\n` +
    `🍎 Sistema: ${BRAND.system}\n🕐 ${new Date().toLocaleString('es-ES', {timeZone: 'Europe/Madrid'})}\n\n🏢 ${BRAND.company}`;
  ctx.reply(stats, { parse_mode: 'Markdown', ...mainMenu });
});

bot.catch((err, ctx) => {
  console.error('❌ Bot error:', err);
  if (ctx) ctx.reply('⚙️ Error técnico. Reintentando...', mainMenu);
});

const startBot = async () => {
  try {
    console.log(`🚀 Starting ${BRAND.name}...`);
    if (process.env.WEBHOOK_URL) {
      await bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ ${BRAND.name} running on port ${PORT}`);
        console.log(`🔗 Health: ${process.env.WEBHOOK_URL}/health`);
      });
    } else {
      await bot.launch();
      console.log(`✅ ${BRAND.name} running in polling mode`);
    }
  } catch (error) {
    console.error('❌ Failed to start:', error);
    process.exit(1);
  }
};

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
startBot();
