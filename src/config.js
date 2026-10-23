// The district this copy of the app is for. Everything district-specific reads from here.
export const DISTRICT = {
  slug: 'kanpur-nagar', // the file in the dashboard's data: districts/<slug>.json
  en: 'Kanpur Nagar',
  hi: 'कानपुर नगर',
}

// Prefix for everything saved on the phone. The district apps share one web address
// (adichandrashekar.github.io), so each needs its own names or they'd overwrite each other.
export const STORE = 'arp-kanpur'
