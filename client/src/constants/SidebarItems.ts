import { useParams } from 'react-router-dom';
import { iconMap } from '../components/common/sidebar/SideBar'

export interface SideBarItems {
    icon: keyof typeof iconMap;
    label: string;
    path: string
    badge?: any;
}


export function CompanySideBarItems(): SideBarItems[] {
    const { id } = useParams();
   return [
        { icon: 'Home', label: 'Dashboard', path: `/company/${id}` },
        { icon: 'MessageCircle', label: 'Messages', path: `/company/message/${id}` },
        { icon: 'Award', label: 'Subscription', path: `/company/plan/${id}` },
        { icon: 'Building2', label: 'Company Profile', path: `/company/profile/${id}/home` },
        { icon: 'Users', label: 'All Applications', path: `/company/application/${id}`},
        { icon: 'FileText', label: 'Job Listing', path: `/company/jobs/${id}` },
      ];
}



export  function UserSideBarItems(): SideBarItems[] {
    return [
        { icon: 'Home', label: 'Dashboard', path: '/'},
        { icon: 'MessageCircle', label: 'Messages', path: '/chat' },
        { icon: 'Briefcase', label: 'Jobs', path: '/jobs' },
        { icon: 'Users', label: 'My Application', path: '/myapplication'},
        { icon: 'Building', label: 'My companies', path: '/mycompany' },
    ]
}



export function CompanySettingsItems(): SideBarItems[] {
     const { id } = useParams()
   return [
        { icon: 'Settings', label: 'Settings', path: `profile/settings/${id}` },
        { icon: 'HelpCircle', label: 'Help Center', path: '#' },
    ]
}



export const AdminSideBarItems = [

]
  