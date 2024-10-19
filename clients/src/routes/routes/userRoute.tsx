import UserLayout from "@/layout/UserLayout"
import ProfilePage from "@/pages/User/ProfilePage"


export const userRoute = {
     path: '',
     element: <UserLayout />,
     children: [
        {
            path: "/profile",
            element: <ProfilePage />
        },
        {
            path: "/job",
            element: <ProfilePage />
        },
     ]
}