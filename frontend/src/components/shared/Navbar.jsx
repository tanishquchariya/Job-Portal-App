import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }
    }

    return (
        // ✅ FIXED: use theme tokens
        <div className='bg-background border-b border-border transition-colors duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                
                {/* Logo */}
                <div>
                    <h1 className='text-2xl font-bold text-foreground'>
                        Job<span className='text-[#F83002]'>Portal</span>
                    </h1>
                </div>

                <div className='flex items-center gap-12'>
                    
                    {/* Nav Links */}
                    <ul className='flex font-medium items-center gap-5 text-muted-foreground'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className="hover:text-foreground">Companies</Link></li>
                                    <li><Link to="/admin/jobs" className="hover:text-foreground">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                                    <li><Link to="/jobs" className="hover:text-foreground">Jobs</Link></li>
                                    <li><Link to="/browse" className="hover:text-foreground">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>

                    {/* Auth Section */}
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant="outline">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    {/* ✅ theme-based button */}
                                    <Button className="bg-primary text-primary-foreground hover:opacity-90">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} />
                                    </Avatar>
                                </PopoverTrigger>

                                <PopoverContent className="w-80 bg-popover text-popover-foreground border-border">
                                    <div>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>
                                                    {user?.profile?.bio}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ✅ FIXED text color */}
                                        <div className='flex flex-col my-2 text-muted-foreground'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link">
                                                            <Link to="/profile">View Profile</Link>
                                                        </Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar