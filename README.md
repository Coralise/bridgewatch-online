# Bridgewatch Online

A Discord server hub for the Bridgewatch faction in Albion Online. Browse and join faction Discord servers organized by region, with live member and online status updates pulled directly from Discord.

## Features

- **Regional Server Organization** - Servers grouped by Asia, America, and Europe
- **Live Discord Integration** - Fetches real-time server data (member counts, online status, server names, icons) from Discord API
- **Server Submission** - Submit your faction Discord server with automatic webhook validation
- **10-Minute Cooldown** - Rate limiting on submissions to prevent spam (persists via localStorage)
- **Skeleton Loading** - Smooth loading animations while data is being fetched
- **Responsive Design** - Works beautifully on desktop and mobile
- **Smooth Animations** - Framer Motion powered transitions and hover effects

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## Project Structure

```
app/
├── page.tsx                 # Main landing page
├── layout.tsx              # Root layout
├── data/
│   └── servers.ts         # Server data and Discord API integration
└── components/
    ├── ServerCard.tsx     # Individual server card with loading states
    └── SubmitSection.tsx  # Server submission form with webhook integration
public/
├── images/
│   ├── Bridgewatch.jpeg   # Hero background image
│   └── BridgewatchIcon.png # Icon image
```

## How It Works

### Server Data

Server data is stored in `app/data/servers.ts` with only the invite link and description. When the page loads, the app fetches additional details from Discord:

```typescript
// Input: Just the invite link
{
  inviteLink: "https://discord.gg/...",
  description: "...",
  region: "Asia"
}

// Output: Enriched with Discord data
{
  name: "Server Name",
  memberCount: 1234,
  onlineCount: 567,
  iconUrl: "https://cdn.discordapp.com/icons/...",
  ...
}
```

### Discord API Integration

Uses the Discord REST API v10 to fetch server details:
```
GET https://discord.com/api/v10/invites/{invite_code}?with_counts=true&with_expiration=true
```

This provides live member counts, server names, and icon URLs.

### Server Submission

When users submit a server:
1. Form data is validated
2. Sent to Discord webhook as an embedded message
3. 10-minute cooldown enforced via localStorage
4. Success/error feedback shown to user

## Environment Variables

No environment variables required. The Discord webhook URL is configured in `app/components/SubmitSection.tsx`.

## License

All rights reserved. © 2026 Coral Reef Studios.
