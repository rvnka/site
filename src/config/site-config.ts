import type { SiteConfig } from '@/types';

const meta = {
  title: 'Rinn',
  description: 'Rinn - personal site and portfolio.',
  url: 'https://site.rvnka.my.id',
  icon: '/api/brand?type=icon',
  ogImage: '/api/brand?type=og',
} as const;

const profile = {
  name: 'Rinn',
  username: '@rvnka',
  avatar: 'https://avatars.githubusercontent.com/u/99320495',
  bio: 'I am a beginner developer, editor and student who enjoys learning new things and breaking stuff‽. I build things out of curiosity, interest, and the fun of seeing ideas turn into something real.',
  email: '',
  startYear: 2020,
  location: 'Earth',
  available: false,
} as const;

const roles = ['Developer', 'Editor', 'Student', 'Gamer', 'Anime Lover'] as const;

const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/project' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

const social = [
  {
    label: 'Twitter / X',
    href: '#',
    icon: 'bi-twitter-x',
    username: '@',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/rvnka',
    icon: 'bi-github',
    username: 'rvnka',
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: 'bi-linkedin',
    username: '',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@rvnka_yt',
    icon: 'bi-youtube',
    username: '@rvnka_yt',
  },
  {
    label: 'Discord',
    href: 'https://discord.com/users/1007123238985412608',
    icon: 'bi-discord',
    username: 'ringga',
  },
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    icon: 'bi-envelope',
    username: '',
  },
] as const;

const skills = [
  { name: 'HTML', icon: 'bi-filetype-html', color: '#e34f26' },
  { name: 'CSS', icon: 'bi-css', color: '#264de4' },
  { name: 'JavaScript', icon: 'bi-javascript', color: '#f7df1e' },
  { name: 'Node.js', icon: 'bi-server', color: '#339933' },
  { name: 'TypeScript', icon: 'bi-typescript', color: '#3178c6' },
  { name: 'Shell', icon: 'bi-filetype-sh', color: '#89e051' },
  { name: 'Bash', icon: 'bi-filetype-sh', color: '#4eaa25' },
  { name: 'Python', icon: 'bi-filetype-py', color: '#3776ab' },
  { name: 'Git', icon: 'bi-git', color: '#f05032' },
  { name: 'Linux', icon: 'bi-tux', color: '#fcc624' },
  { name: 'Android', icon: 'bi-android', color: '#3ddc84' },
] as const;

const timeline = [
  {
    year: '2020',
    title: 'First Line of Code',
    description:
      'Started learning HTML & CSS out of curiosity. Built my first static webpage and got hooked. Learned JavaScript fundamentals, and built small interactive projects.',
  },
  {
    year: '2021',
    title: 'The Penguin (Tux) and The Snake (Python)',
    description:
      'Surfing the internet and discovered Linux, get hooked to Shell & Bash scripting and Python.',
  },
  {
    year: '2022-2023',
    title: 'A Frameworks? And Ecosystem? What is that?',
    description:
      'Dived into Node.js and discovered the power of JavaScript. Started learning and creating.',
  },
  {
    year: '2024-Present',
    title: 'What now?, idk.',
    description: 'Creating some projects~',
  },
] as const;

const edu_timeline = [
  {
    year: '2008 - 2018',
    institution: 'Early Childhood Education and Elementary School',
    description:
      'Developed foundational social and academic skills during the formative years.',
  },
  {
    year: '2020 - 2023',
    institution: 'Junior High School',
    description:
      'Balanced core academic requirements while discovering a passion for digital technology.',
  },
  {
    year: '2024 - Present',
    institution: 'Vocational High School',
    description:
      'Pursuing creative storytelling and cinematography while maintaining a self-taught engineering path.',
  },
] as const;

/**
 * Site configuration object containing all metadata, profile, and navigation data
 */
export const siteConfig = {
  meta,
  profile,
  roles,
  nav,
  social,
  skills,
  timeline,
  edu_timeline,
} as const satisfies SiteConfig;
