// events/welcomeOnJoin.js
module.exports = function init({ sock, CONFIG, logger }) {
  // helper: normalize our JID
  const myJid = (() => {
    try {
      const raw = sock?.user?.id || "";                 // e.g. "12345:1@s.whatsapp.net"
      const num = raw.split("@")[0].split(":")[0];       // "12345"
      return `${num}@s.whatsapp.net`;
    } catch { return ""; }
  })();

  sock.ev.on("group-participants.update", async (ev) => {
    try {
      // Only care when someone is added AND that someone is the bot itself
      if (ev.action !== "add" || !Array.isArray(ev.participants)) return;
      if (!myJid || !ev.participants.includes(myJid)) return;

      // Fetch group metadata to show subject and admins
      const meta = await sock.groupMetadata(ev.id);
      const admins = (meta.participants || [])
        .filter(p => p.admin) // 'admin' | 'superadmin'
        .map(p => "@" + (p.id || "").split("@")[0]);

      // Build message
      const owners = Array.isArray(CONFIG.owner) ? CONFIG.owner.join(", ") : (CONFIG.owner || "");
      const dashUrl = CONFIG.dashboard?.url || `http://localhost:${process.env.PORT || 10000}`;
      const prefix = CONFIG.prefix || "!";
      const botNum = CONFIG.botNumber || "Not set";

      let text = `👋 *Hello ${meta.subject}*!\n`;
      text += `\n🤖 *${CONFIG.botName}* is now active in this group.`;
      text += `\n• Prefix: \`${prefix}\``;
      text += `\n• Bot Number: ${botNum}`;
      text += `\n• Owner(s): ${owners}`;
      text += `\n• Dashboard: ${dashUrl}`;
      text += `\n• Help: type \`${prefix}help\``;
      if (admins.length) text += `\n\n👮 *Group Admins:* ${admins.join(", ")}`;
      // When the bot joins a new group it should not be active until approved.
      // Mark this group as pending in the approval store and append an approval
      // instruction to the welcome message. If addPending fails it will be
      // silently ignored.
      try {
        const store = require('../utils/approvalStore');
        await store.addPending(ev.id, { name: meta.subject });
      } catch {}

      text += `\n\n⚠️ This group is currently *unapproved*. `;
      text += `Please ask the bot owner to type \`${prefix}approve\` in this group to activate the bot.`;

      await sock.sendMessage(
        ev.id,
        { text, mentions: admins.map(a => a.replace("@", "") + "@s.whatsapp.net") },
      );
      logger?.info?.(`Sent join-welcome to ${meta.subject} (pending approval)`);
    } catch (e) {
      logger?.error?.(`welcomeOnJoin error: ${e.message}`);
    }
  });
};
