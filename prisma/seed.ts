import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HyperWeather database...');

  // 1. Clear existing data
  await prisma.weatherCache.deleteMany({});
  await prisma.communityReport.deleteMany({});
  await prisma.savedLocation.deleteMany({});
  await prisma.userSettings.deleteMany({});

  // 2. Seed Default User Settings
  const settings = await prisma.userSettings.create({
    data: {
      userId: 'default-user',
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      precipitationUnit: 'mm',
      timeFormat: '24h',
      theme: 'dark',
      alertsEnabled: true,
      alertRadius: 25,
      language: 'en',
    },
  });
  console.log('Seeded UserSettings:', settings);

  // 3. Seed Favorite Saved Locations
  const locations = [
    {
      userId: 'default-user',
      name: 'New York City',
      latitude: 40.7128,
      longitude: -74.0060,
      country: 'United States',
      countryCode: 'US',
      admin1: 'New York',
      timezone: 'America/New_York',
      isPrimary: true,
      sortOrder: 0,
    },
    {
      userId: 'default-user',
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country: 'United Kingdom',
      countryCode: 'GB',
      admin1: 'England',
      timezone: 'Europe/London',
      isPrimary: false,
      sortOrder: 1,
    },
    {
      userId: 'default-user',
      name: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
      country: 'Japan',
      countryCode: 'JP',
      admin1: 'Tokyo',
      timezone: 'Asia/Tokyo',
      isPrimary: false,
      sortOrder: 2,
    },
    {
      userId: 'default-user',
      name: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
      country: 'Singapore',
      countryCode: 'SG',
      admin1: 'Central Singapore',
      timezone: 'Asia/Singapore',
      isPrimary: false,
      sortOrder: 3,
    },
  ];

  for (const loc of locations) {
    const created = await prisma.savedLocation.create({ data: loc });
    console.log(`Seeded saved location: ${created.name}`);
  }

  // 4. Seed Community Weather Reports around New York
  const reports = [
    {
      latitude: 40.73061,
      longitude: -73.935242,
      reportType: 'rain',
      severity: 2,
      description: 'Drizzle turning into moderate rain in Greenpoint.',
      verified: true,
      expiresAt: new Date(Date.now() + 4 * 3600000), // 4 hours from now
    },
    {
      latitude: 40.7128,
      longitude: -74.0060,
      reportType: 'storm',
      severity: 4,
      description: 'Loud thunder and constant lightning over Lower Manhattan!',
      verified: true,
      expiresAt: new Date(Date.now() + 2 * 3600000),
    },
    {
      latitude: 40.7589,
      longitude: -73.9851,
      reportType: 'wind',
      severity: 3,
      description: 'High winds near Times Square. Very strong drafts between buildings.',
      verified: false,
      expiresAt: new Date(Date.now() + 3 * 3600000),
    },
  ];

  for (const rep of reports) {
    const created = await prisma.communityReport.create({ data: rep });
    console.log(`Seeded community report: ${created.reportType} at ${created.latitude}, ${created.longitude}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
