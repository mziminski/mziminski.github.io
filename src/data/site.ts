/**
 * Public facts and blanks for the site.
 *
 * TODO(matt): read the "Edit me" list in the README and replace anything
 * that should not be published. Do not add employers, clients, metrics,
 * awards, or testimonials unless they are yours and you can stand behind them.
 */
export const site = {
  name: 'Matt Ziminski',
  url: 'https://mziminski.github.io',
  role: 'Software engineer',
  description:
    'Software engineer working across geospatial systems, software engineering, and AI systems engineering.',
  // TODO(matt): confirm this address still reaches you. It is the one published on the previous version of this site.
  email: 'mzimin2@uic.edu',
  github: 'https://github.com/mziminski',
  githubHandle: 'mziminski',
  // TODO(matt): confirm this is the profile URL you want linked.
  linkedin: 'https://www.linkedin.com/in/matthew-ziminski-7b4392190/',
  // TODO(matt): add a place if you want one shown. An empty string hides the line.
  location: '',
  education: {
    school: 'University of Illinois Chicago',
    credential: 'B.S. and M.S., Computer Science',
    // Carried from the previous version of this site (published there as May 6, 2023).
    // TODO(matt): confirm the wording before you treat it as final.
    graduated: '6 May 2023',
  },
  earlierWork: [
    {
      href: 'https://github.com/mziminski/NOAA-3D-CH4-IVT',
      label: 'NOAA-3D-CH4-IVT',
      note: 'Public repository. A visualization tool for the NOAA CarbonTracker-CH4 dataset.',
    },
    {
      href: 'https://github.com/mziminski/CS-424_Project-01',
      label: 'CS 424, Project 01',
      note: 'Course project. Energy-production charts in R and Shiny.',
    },
    {
      href: 'https://github.com/mziminski/CS-424_Project-02',
      label: 'CS 424, Project 02',
      note: 'Course project. Plant-generation maps in R and Leaflet.',
    },
  ],
} as const;

export const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/notes/', label: 'Notes' },
  { href: '/resume/', label: 'Resume' },
  { href: '/contact/', label: 'Contact' },
] as const;

export function isActive(href: string, path: string) {
  if (href === '/') return path === '/';
  return path === href || path.startsWith(href);
}
