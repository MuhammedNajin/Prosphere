import { iconMap } from '../components/common/sidebar/SideBar'

export interface SideBarItems {
    icon: keyof typeof iconMap;
    label: string;
    badge?: any;
}

export const CompanySideBarItems: SideBarItems[] = [
    { icon: 'Home', label: 'Dashboard' },
    { icon: 'MessageCircle', label: 'Messages' },
    { icon: 'Building2', label: 'Company Profile' },
    { icon: 'Users', label: 'All Applications' },
    { icon: 'FileText', label: 'Job Listing' },
    { icon: 'Calendar', label: 'My Schedule' },
  ];

export const UserSideBarItems: SideBarItems[] = [
    { icon: 'Home', label: 'Home' },
    { icon: 'Users', label: 'My connections' },
    { icon: 'Briefcase', label: 'Jobs' },
    { icon: 'MessageCircle', label: 'Talk' },
    { icon: 'Award', label: 'Get Premium' },
    { icon: 'Building', label: 'My companies' },
];


export const CompanySettingsItems: SideBarItems[] = [
    { icon: 'Settings', label: 'Settings' },
    { icon: 'HelpCircle', label: 'Help Center' },
]


export const AdminSideBarItems = [

]
  