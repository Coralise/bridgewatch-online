export interface ServerData {
  inviteLink: string;
  description: string;
  region: 'Asia' | 'America' | 'Europe';
  name?: string;
  memberCount?: number;
  onlineCount?: number;
  iconColor?: string;
  iconUrl?: string;
  usualCallers?: string[];
}

export interface DiscordInvite {
  code: string;
  guild: {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
    features: string[];
  };
  approximate_member_count: number;
  approximate_presence_count: number;
}

const colorClasses = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-purple-500 to-purple-600',
  'bg-gradient-to-br from-pink-500 to-pink-600',
  'bg-gradient-to-br from-green-500 to-green-600',
  'bg-gradient-to-br from-yellow-500 to-yellow-600',
  'bg-gradient-to-br from-red-500 to-red-600',
  'bg-gradient-to-br from-indigo-500 to-indigo-600',
  'bg-gradient-to-br from-cyan-500 to-cyan-600',
];

export async function enrichServerData(server: ServerData): Promise<ServerData> {
  try {
    // Extract invite code from URL
    const inviteCode = server.inviteLink.split('/').pop();
    if (!inviteCode) throw new Error('Invalid invite link');

    // Fetch from Discord API
    const response = await fetch(
      `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=true`
    );

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    const data: DiscordInvite = await response.json();

    const colorIndex = data.guild.id.charCodeAt(0) % colorClasses.length;
    const iconColor = colorClasses[colorIndex];

    // Construct icon URL from guild ID and icon hash
    const iconUrl = data.guild.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`
      : undefined;

    return {
      ...server,
      name: data.guild.name,
      memberCount: data.approximate_member_count,
      onlineCount: data.approximate_presence_count,
      iconColor,
      iconUrl,
    };
  } catch (error) {
    console.error(`Failed to fetch server details for ${server.inviteLink}:`, error);
    // Return server with default values if fetch fails
    return {
      ...server,
      name: 'Unknown Server',
      memberCount: 0,
      onlineCount: 0,
      iconColor: 'bg-gradient-to-br from-gray-500 to-gray-600',
      iconUrl: undefined,
    };
  }
}

export const servers: ServerData[] = [
  // Asia
  {
    inviteLink: "https://discord.gg/buuP3NEWZ2",
    description: 'Needs verification. Requires Desert Viper Rank and above for lethal content.',
    region: 'Asia',
    usualCallers: ['Kalevo', 'MiyamotoMusashii', 'kluster'],
  },
  {
    inviteLink: "https://discord.gg/Ssybbdc8qx",
    description: '',
    region: 'Asia',
    usualCallers: ['Drovath', 'PenghuniiiiHITAM', 'ZTofu', 'Gawloo', 'Reignhardt'],
  },
  {
    inviteLink: "https://discord.gg/RnSBBqnSuf",
    description: 'Guild Server. Needs verification.',
    region: 'Asia',
    usualCallers: ['Tragdik', 'ZTofu', 'MermaidManX', 'Zampo', 'Hakuina'],
  },
  {
    inviteLink: "https://discord.gg/gkBjPWkH3",
    description: 'Indonesian Guild Server.',
    region: 'Asia',
    usualCallers: ['Rabbitjai'],
  },
]