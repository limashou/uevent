import {Component, lazy} from "react";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {ThemeProvider} from "@mui/material";

import AuthLayout from "./pages/auth/AuthLayout";
import UserLayout from "./pages/users/UserLayout";
import Profile from "./pages/users/Profile";
import ProfileSettings from "./pages/users/ProfileSettings";
import RootLayout from "./pages/RootLayout";
import CompaniesLayout from "./pages/companies/CompaniesLayout";
import Companies from "./pages/companies/Companies";
import CompanyCreation from "./pages/companies/CompanyCreation";
import theme from "./Theme";
import Company from "./pages/companies/Company";
import CompanySettings from "./pages/companies/CompanySettings";
import CompanyDataWrapper from "./pages/companies/CompanyDataWrapper";
import AcceptInvitation from "./pages/AcceptInvitation";
import EventCreation from "./pages/companies/EventCreation";
import EventLayout from "./pages/events/EventLayout";
import Events from "./pages/events/Events";
import Event from "./pages/events/Event";
import EventSettings from "./pages/events/EventSettings";
import EventDataWrapper from "./pages/events/EventDataWrapper";
import News from "./pages/companies/news/News";
import AnnouncementCreation from "./pages/companies/news/AnnouncementCreation";
import Announcement from "./pages/companies/news/Announcement";
import AnnouncementEdit from "./pages/companies/news/AnnouncementEdit";

const Login = lazy(() => import("./pages/auth/Login"));
const Registration = lazy(() => import("./pages/auth/Registration"));
const PasswordRecovery = lazy(() => import("./pages/auth/PasswordRecovery"));
const PasswordReset = lazy(() => import("./pages/auth/PasswordReset"));


function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />}>
                <Route path="auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="registration" element={<Registration />} />
                    <Route path="password-recovery" element={<PasswordRecovery />} />
                    <Route path="password-reset/:token" element={<PasswordReset />} />
                </Route>
                <Route path="companies" element={<CompaniesLayout />} >
                    <Route index element={<Companies />} />
                    <Route path="creation" element={<CompanyCreation />} />
                    <Route path=":company_id" element={<CompanyDataWrapper />}>
                        <Route index element={<Company />} />
                        <Route path="settings" element={<CompanySettings />} />
                        <Route path="eventCreation" element={<EventCreation />} />
                        <Route path="newsCreation" element={<AnnouncementCreation />} />
                    </Route>
                </Route>
                <Route path="users" element={<UserLayout />}>
                    <Route path="me/settings" element={<ProfileSettings />} />
                    <Route path=":user_id" element={<Profile />} />
                </Route>
                <Route path="events" element={<EventLayout />}>
                    <Route index element={<Events />} />
                    <Route path=":event_id" element={<EventDataWrapper />} >
                        <Route index element={<Event />} />
                        <Route path="settings" element={<EventSettings />} />
                    </Route>
                </Route>
                <Route path="accept-invitation/:invitationCode" element={<AcceptInvitation />}/>
            </Route>
        )
    );

    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    );
}

export default App;
