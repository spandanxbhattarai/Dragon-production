"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Menu, X, Home, BookOpen, PenTool, Bell, Megaphone,
    FileText, Calendar, Users, 
    GraduationCap,  ClipboardList, 
     FileQuestion,  Briefcase,
     Newspaper, FolderPlus,
     Layers,
    User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const DashboardSidebar = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<{ role?: string }>({});
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Fetch user information
    useEffect(() => {
        const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : {};
        setUser(userData);
    }, []);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(true);
            } else {
                setIsMenuOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMenuOpen &&
                window.innerWidth < 1024 &&
                !target.closest('.sidebar') &&
                !target.closest('.menu-toggle')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleCategory = (category: string) => {
        if (activeCategory === category) {
            setActiveCategory(null);
        } else {
            setActiveCategory(category);
        }
    };

    const handleLogout = () => {
        Cookies.remove("user");
        Cookies.remove("token")
        router.push("/login")
    }

    // Determine user role
    const isAdmin = user.role === "admin";
    const isTeacher = user.role === "teacher";
    const isStudent = user.role === "user";

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-100 font-Urbanist">
            {/* Mobile menu toggle */}
            <button
                onClick={toggleMenu}
                className={`menu-toggle lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md ${!isMenuOpen ? "bg-[#102c34]" : null} text-white shadow-lg`}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? null : <Menu size={20} />}
            </button>

            {/* Overlay for mobile */}
            {isMenuOpen && window.innerWidth < 1024 && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 bg-opacity-50 z-20"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <div className="flex h-full w-full">
                {/* Sidebar */}
                <aside
                    className={`sidebar fixed lg:relative z-30 h-full flex flex-col transform transition-all duration-300
                        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                        lg:translate-x-0 w-72 max-w-[85vw]
                        bg-[#102c34] text-white shadow-xl`}
                >
                    <div className="p-4 border-b border-[#102c34] flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <GraduationCap className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Dragon</h2>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="lg:hidden p-1 rounded-md hover:bg-[#102c34]"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* User info */}
                    <div className="p-4 border-b border-[#102c34] flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white text-black  flex items-center justify-center">
                            <span className="font-semibold">{user.role?.charAt(0).toUpperCase() || "U"}</span>
                        </div>
                        <div>
                            <p className="font-medium">{user.role || "User"}</p>
                            <p className="text-xs text-white">Dashboard</p>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent">
                        <div className="px-2">
                            {/* Common navigation for all users */}
                            <div className="mb-3">
                                <p className="px-3 py-2 text-xs font-semibold text-white uppercase tracking-wider">
                                    Main
                                </p>
                                <ul className="space-y-1">
                                    <li>
                                        <Link href="/dashboard/introduction" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-white hover:bg-white text-sm"
                                            >
                                                <Home size={18} className="mr-2" />
                                                Introduction
                                            </Button>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Admin and Teacher Navigation */}
                            {(isAdmin || isTeacher) && (
                                <>
                                    {/* Course Management */}
                                    <div className="mb-3">
                                        <Collapsible
                                            open={activeCategory === 'courses'}
                                            onOpenChange={() => toggleCategory('courses')}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-between text-white hover:bg-white  text-sm"
                                                >
                                                    <div className="flex items-center">
                                                        <BookOpen size={18} className="mr-2" />
                                                        <span>Course Management</span>
                                                    </div>
                                                    <span className={`transform transition-transform ${activeCategory === 'courses' ? 'rotate-90' : ''}`}>
                                                        {'>'}
                                                    </span>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-6 space-y-1">
                                                <Link href="/dashboard/addCourses" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <FolderPlus size={16} className="mr-2" />
                                                        Add Courses
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/updateCourses" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <PenTool size={16} className="mr-2" />
                                                        Update Courses
                                                    </Button>
                                                </Link>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>

                                    {/* Announcements & Ads */}
                                    <div className="mb-3">
                                        <Collapsible
                                            open={activeCategory === 'announcements'}
                                            onOpenChange={() => toggleCategory('announcements')}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-between text-white hover:bg-white  text-sm"
                                                >
                                                    <div className="flex items-center">
                                                        <Bell size={18} className="mr-2" />
                                                        <span>Announcements & Ads</span>
                                                    </div>
                                                    <span className={`transform transition-transform ${activeCategory === 'announcements' ? 'rotate-90' : ''}`}>
                                                        {'>'}
                                                    </span>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-6 space-y-1">
                                                <Link href="/dashboard/createAnnouncement" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Bell size={16} className="mr-2" />
                                                        Create Announcement
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/manageAnnouncement" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Layers size={16} className="mr-2" />
                                                        Manage Announcements
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/createAdvertisement" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Megaphone size={16} className="mr-2" />
                                                        Create Advertisement
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/manageAdvertisement" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Layers size={16} className="mr-2" />
                                                        Manage Advertisements
                                                    </Button>
                                                </Link>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>

                                    {/* Class Materials */}
                                    <div className="mb-3">
                                        <Collapsible
                                            open={activeCategory === 'materials'}
                                            onOpenChange={() => toggleCategory('materials')}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-between text-white hover:bg-white  text-sm"
                                                >
                                                    <div className="flex items-center">
                                                        <FileText size={18} className="mr-2" />
                                                        <span>Class Materials</span>
                                                    </div>
                                                    <span className={`transform transition-transform ${activeCategory === 'materials' ? 'rotate-90' : ''}`}>
                                                        {'>'}
                                                    </span>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-6 space-y-1">
                                                <Link href="/dashboard/addClassMaterial" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <FolderPlus size={16} className="mr-2" />
                                                        Create Materials
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/manageClassMaterial" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Layers size={16} className="mr-2" />
                                                        Manage Materials
                                                    </Button>
                                                </Link>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>

                                    {/* Exams */}
                                    <div className="mb-3">
                                        <Collapsible
                                            open={activeCategory === 'exams'}
                                            onOpenChange={() => toggleCategory('exams')}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-between text-white hover:bg-white  text-sm"
                                                >
                                                    <div className="flex items-center">
                                                        <ClipboardList size={18} className="mr-2" />
                                                        <span>Exam Management</span>
                                                    </div>
                                                    <span className={`transform transition-transform ${activeCategory === 'exams' ? 'rotate-90' : ''}`}>
                                                        {'>'}
                                                    </span>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-6 space-y-1">
                                                <Link href="/dashboard/scheduleExam" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Calendar size={16} className="mr-2" />
                                                        Schedule Exam
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/manageExam" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Layers size={16} className="mr-2" />
                                                        Manage Exams
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/addquestion" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <FileQuestion size={16} className="mr-2" />
                                                        Add Questions
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/managequestionsheet" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <FileQuestion size={16} className="mr-2" />
                                                        Manage Questions
                                                    </Button>
                                                </Link>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>

                                    {/* Events & News */}
                                    <div className="mb-3">
                                        <Collapsible
                                            open={activeCategory === 'events'}
                                            onOpenChange={() => toggleCategory('events')}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-between text-white hover:bg-white  text-sm"
                                                >
                                                    <div className="flex items-center">
                                                        <Calendar size={18} className="mr-2" />
                                                        <span>Events & News</span>
                                                    </div>
                                                    <span className={`transform transition-transform ${activeCategory === 'events' ? 'rotate-90' : ''}`}>
                                                        {'>'}
                                                    </span>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-6 space-y-1">
                                                <Link href="/dashboard/createEvents" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Calendar size={16} className="mr-2" />
                                                        Create Events
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/manageEvents" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Layers size={16} className="mr-2" />
                                                        Manage Events
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/addNews" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Newspaper size={16} className="mr-2" />
                                                        Add News
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/updateNews" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Layers size={16} className="mr-2" />
                                                        Manage News
                                                    </Button>
                                                </Link>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>


                                    {/* Users & Batches */}
                                    <div className="mb-3">
                                        <Collapsible
                                            open={activeCategory === 'users'}
                                            onOpenChange={() => toggleCategory('users')}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-between text-white hover:bg-white  text-sm"
                                                >
                                                    <div className="flex items-center">
                                                        <Users size={18} className="mr-2" />
                                                        <span>Users & Batches</span>
                                                    </div>
                                                    <span className={`transform transition-transform ${activeCategory === 'users' ? 'rotate-90' : ''}`}>
                                                        {'>'}
                                                    </span>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-6 space-y-1">
                                                <Link href="/dashboard/users" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Users size={16} className="mr-2" />
                                                        Manage Users
                                                    </Button>
                                                </Link>
                                                <Link href="/dashboard/manageBatch" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <Briefcase size={16} className="mr-2" />
                                                        Manage Batches
                                                    </Button>
                                                </Link>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                </>
                            )}

                            {/* Student Navigation */}
                            {isStudent && (
                                <>
                                    <div className="mb-3">
                                        <p className="px-3 py-2 text-xs font-semibold text-white uppercase tracking-wider">
                                            Student Portal
                                        </p>
                                        <ul className="space-y-1">
                                            <li>
                                                <Link href="/dashboard/studentsCourse" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <BookOpen size={18} className="mr-2" />
                                                        Courses & Meetings
                                                    </Button>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/dashboard/exams" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <ClipboardList size={18} className="mr-2" />
                                                        Exams
                                                    </Button>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/dashboard/userProfile" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <User size={18} className="mr-2" />
                                                        Profile
                                                    </Button>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/dashboard/classMaterials" onClick={() => window.innerWidth < 1024 && setIsMenuOpen(false)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-white hover:bg-white  text-sm"
                                                    >
                                                        <FileText size={18} className="mr-2" />
                                                        Study Materials
                                                    </Button>
                                                </Link>
                                            </li>

                                        </ul>
                                    </div>
                                </>
                            )}


                        </div>
                    </nav>

                    <div className="p-4 border-t border-[#102c34] mt-auto">
                        <Button
                            variant="ghost"
                            onClick={() => handleLogout()}
                            className="w-full justify-start text-white hover:bg-white  text-sm bg-[#102c34]"

                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Logout
                        </Button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 h-full overflow-y-auto">
                    <div className=" min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardSidebar;