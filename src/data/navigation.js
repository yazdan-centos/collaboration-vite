export const navSections = [
  {
    title: 'منوی اصلی',
    items: [
      { icon: 'fas fa-ticket', label: 'تیکت‌ها', path: '/tickets', badge: '۱۲' },
      { icon: 'fas fa-list-check', label: 'تسک‌ها', path: '/tasks', badge: '۱۲' },
      { icon: 'fas fa-diagram-project', label: 'پروژه‌ها', path: '/projects' },
      { icon: 'fas fa-file-contract', label: 'قراردادهای SLA', path: '/sla-contracts' },
      { icon: 'fas fa-handshake', label: 'جلسات تیمی', path: '/meetings' },
      { icon: 'fas fa-chart-column', label: 'چتروم تیکت', path: '/reports' },
    ],
  },
  {
    title: 'مدیریت',
    items: [
      { icon: 'fas fa-users', label: 'تیم', path: '/team' },
      { icon: 'fas fa-clients', label: 'مشتریان', path: '/clients' },
      {
        icon: 'fas fa-file-alt',
        label: 'راهنمای برنامه',
        path: '/applicationGuide',
        badge: '۳',
        badgeColor: 'var(--warning)',
      },
    ],
  },
];

export const flatNavItems = navSections.flatMap((section) => section.items);
